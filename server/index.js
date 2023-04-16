require('dotenv').config();
const express = require('express');
const fs = require('fs');
const sqlite3 = require('sqlite3'); // Doc: https://github.com/TryGhost/node-sqlite3/wiki/API
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const multer = require('multer'); // usado para tratar o salvamento de arquivos
const path = require('path');

const PORT = process.env.PORT;
const SECRET = process.env.JWT_SECRET;

const db = new sqlite3.Database('./../db/olx.db');
const userPassword = bcrypt.hashSync(process.env.USER_PASSWORD, 10);

db.run('UPDATE user SET password = ? WHERE id = 1', userPassword, (err, result) => {
  if (err) throw err;
});



/**
 * Remover um diretório, incluindo todos os seus arquivos e subdiretórios, 
 * mesmo que não esteja vazio
 * @param {string} dir diretório a ser removido Exp.: "./images/tmp/"
 */
function removeDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isDirectory()) {
        removeDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
    fs.rmdirSync(dir);
    console.log(`O diretório ${dir} foi removido com sucesso!`);
  } else {
    console.log(`O diretório ${dir} não existe.`);
  }
}


// Remove Diretorio Temporário de Images
// removeDirectory(process.env.TEMP_IMAGE_DIR);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Caso o diretório temporário de imagens não exita crie-o
    if (!fs.existsSync(process.env.TEMP_IMAGE_DIR)) fs.mkdirSync(process.env.TEMP_IMAGE_DIR);
    cb(null, process.env.TEMP_IMAGE_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 10000)}${ext}`;
    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido.'));
    }
  }
});



// Crie um aplicativo Express
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// Use o body-parser para analisar as solicitações com o corpo em JSON
app.use(bodyParser.json());
app.use(cors());


// middleware para verificar o token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.email = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};


// Rota teste
app.get('/', (req, res) => {
  res.json({ JWT_SECRET: SECRET, PORT: PORT });
});


// endpoint para autenticação
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  const sql = `SELECT * FROM user WHERE email = ? LIMIT 1`;

  try {

    db.get(sql, [email], (err, result) => {
      if (err) throw err;

      // Verifica se encontrou o e-mail do usuário
      if (!result) return res.status(401).json({ error: 'Email incorreto' });
      
      // Verificar as informações do usuário
      if (!bcrypt.compareSync(password, result.password)) {
        return res.status(401).json({ error: 'Usuário ou senha incorretos' });
      }
    
      // Gerar um token JWT
      const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });

      // Retornar o token JWT
      return res.json({ token });

    });
    
  } catch (e) {
    return res.status(401).json({ error: e.message });
  }
});

// endpoint Logout
app.post('/api/logout', verifyToken, (req, res) => {
  // res.clearCookie('jwtToken');
  res.json({message: 'sucesso'});
});

// endpoint estados
app.post('/api/register', (req, res) => {
  const { name, email, stateLoc, password } = req.body;
  db.get('SELECT MAX(id) AS id FROM user', (err, result) => {
    if (err) throw err;
    const values = [result.id + 1, name, email, stateLoc, bcrypt.hashSync(password, 10)];
    const sql = 'INSERT INTO user VALUES (?, ?, ?, ?, ?)';
    db.run(sql, values, (err, result) => {
      if (err) throw err;
      console.log(`Usuário: ${email} - criado com sucesso!`);
      // Gerar um token JWT
      const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
      // Retornar o token JWT
      return res.json({ token });
    });
  });
});

// endpoint estados
app.get('/api/uf', (req, res) => {
  const sql = 'SELECT * FROM uf';
  db.all(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// endpoint categoria
app.get('/api/categoria', (req, res) => {
  const sql = 'SELECT * FROM categoria';
  db.all(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// endpoint ads
app.get('/api/ads', (req, res) => {
  let { category, uf, q, limit, page } = req.query;
  let filters = [];
  let sql = `
  SELECT a.*, ai.image 
  FROM ad a 
  INNER JOIN ad_image ai ON ai.ad_id = a.id `;

  if (uf) {
    sql = sql + 'INNER JOIN user u ON u.id = a.user_id ';
    filters.push('u.uf = ?');
  }
  if (category) filters.push('a.categoria_id = ?');
  if (q) filters.push("a.title LIKE ?");

  if (filters.length) sql = sql + `WHERE ${filters.join(' AND ')} `;

  sql = sql + 'GROUP BY a.id';

  
  filters = [];
  if (uf) filters.push(uf);
  if (category) filters.push(category);
  if (q) filters.push(`%${q}%`);

  db.all(sql, filters, (err, result) => {
    if (err) throw err;
    if (result.length) {
      const currentPage = (page && page > 1) ? +page : 1;
      limit = (limit && limit > 2) ? limit : 2;
      const totalPage = Math.ceil(result.length / limit);
      
      const offset = (currentPage - 1) * limit;

      sql = `${sql} LIMIT ${limit} OFFSET ${offset}`;
      db.all(sql, filters, (err, result) => {
        if (err) throw err;
        res.json({ currentPage, totalPage, result });
      });
    } 
    else res.json({ currentPage: 1, totalPage: 1, result: [] });
  });
});

// endpoint ad
app.get('/api/ad/:id', (req, res) => {
  const { id } = req.params;
  const { s } = req.query;
  const sql = `
  SELECT 
    a.*, 
    u.name AS user_name, 
    u.email, 
    u.uf, 
    c.description AS categoria_description, 
    c.slug AS categoria_slug, 
    ai.image 
  FROM ad a 
  INNER JOIN user u ON u.id = a.user_id
  INNER JOIN categoria c ON c.id = a.categoria_id
  INNER JOIN ad_image ai ON ai.ad_id = a.id 
  WHERE a.id = ?`;
  db.all(sql, [id], (err, result) => {
    if (err) throw err;
    if (result.length) {
      let data = {...result[0]};
      delete data.image;
      data.images = [];
      result.forEach(item => data.images.push(item.image));
      // trazer todos os anúncios do usuário
      if (s == 1) {
        db.all(`
        SELECT a.*, ai.image 
        FROM ad a 
        INNER JOIN ad_image ai ON ai.ad_id = a.id
        WHERE a.user_id = ? 
        AND a.id <> ?
        GROUP BY a.id`, [data.user_id, id], (err, result) => {
          if (err) throw err;
          data.similares = result;
          return res.json(data);
        });
      } 
      else return res.json(data);
    }
    else return res.json({});
  });
});


const removeImages = files => {
  [].map.call(files, img => fs.unlinkSync(process.env.TEMP_IMAGE_DIR + img.filename));
};

app.post('/api/ad', verifyToken, upload.array('images', 5), (req, res) => {
  db.get('SELECT id FROM user WHERE email = ?', req.email, (err, result) => {
    if (err) { removeImages(req.files); throw err; }
    
    const user_id = result.id;
    
    db.get('SELECT MAX(id) AS id FROM ad', (err, result) => {
      if (err) { removeImages(req.files); throw err; }
      
      const ad_id = result.id + 1;

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        const sql = 'INSERT INTO ad (id, user_id, categoria_id, title, price, priceNegotiable, description) VALUES (?, ?, ?, ?, ?, ?, ?)';
        let values = [ad_id, user_id, req.body.category, req.body.title, Number(req.body.price.replace('.','$').replace(',','.').replace('$', '')), Number(req.body.priceNegotiable), req.body.description];
        
        db.run(sql, values, err => {
          if (err) { db.run('ROLLBACK'); removeImages(req.files); throw err; }

          values = [].map.call(req.files, img => `(${ad_id}, 'http://localhost:${PORT}/images/tmp/${img.filename}')`).join(',');
          
          db.run(`INSERT INTO ad_image (ad_id, image) VALUES ${values}`, err => {
            if (err) { db.run('ROLLBACK'); removeImages(req.files); throw err; }
            db.run('COMMIT');
            res.json({id: ad_id, message: 'success'});
          });

        });
      });
    });
  });
});


// endpoint images
app.get('/images/:name', (req, res) => {
  const { name } = req.params;
  const filePath = __dirname + '\\images\\' + name;
  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) res.status(404).send('Arquivo não encontrado');
    else res.sendFile(filePath);
  });
});

// endpoint images Ads
app.get('/images/ads/:name', (req, res) => {
  const { name } = req.params;
  const filePath = __dirname + '\\images\\ads\\' + name;
  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) res.status(404).send('Arquivo não encontrado');
    else res.sendFile(filePath);
  });
});

// endpoint images Ads (Temporária, Ads criados pelo usuário acessando o site)
app.get('/images/tmp/:name', (req, res) => {
  const { name } = req.params;
  const filePath = __dirname + '\\images\\tmp\\' + name;
  fs.access(filePath, fs.constants.F_OK, err => {
    if (err) res.status(404).send('Arquivo não encontrado');
    else res.sendFile(filePath);
  });
});


// Inicie o servidor na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor Node.js em execução na porta ${PORT}!`);
});