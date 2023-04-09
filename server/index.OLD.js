require('dotenv').config();
const express = require('express');
const fs = require('fs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const slugify = require('slugify');
const multer = require('multer'); // usado para tratar o salvamento de arquivos
const path = require('path');
// const mime = require('mime-types');

const PORT = process.env.PORT || 3001;
const SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

const USER_PASSWORD = process.env.USER_PASSWORD || '123'; 
const USER_EMAIL = process.env.USER_EMAIL || 'admin@admin.com';
const hashedPassword = bcrypt.hashSync(USER_PASSWORD, 10);

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
removeDirectory(process.env.TEMP_IMAGE_DIR);


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


// Crie uma conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: ''
});

// Verifique se a conexão foi bem-sucedida
connection.connect((err) => {
  if (err) throw err;
  console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
});

var scriptDB = [
  async () => new Promise((resolve, reject) => {
    connection.query('DROP DATABASE IF EXISTS olx', (err, result) => {
      if (err) throw err;
      resolve();
    });
  }),
  async () => new Promise((resolve, reject) => {
    connection.query('CREATE DATABASE olx', (err, result) => {
      if (err) throw err;
      console.log("\n Banco 'olx' CRIADO");
      resolve();
    });
  }),
  async () => new Promise((resolve, reject) => {
    connection.query('USE olx', (err, result) => {
      if (err) throw err;
      resolve();
    });
  }),
  async () => new Promise((resolve, reject) => {
    // TABLE user
    connection.query(`CREATE TABLE user (
      id SMALLINT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
      name VARCHAR(250) NOT NULL,
      email VARCHAR(250) NOT NULL,
      uf CHAR(2) NOT NULL,
      password VARCHAR(250) NOT NULL
    )`
    , (err, result) => {
      if (err) throw err;
      console.log("\n Created 'user' table! [SUCCESS]");
      connection.query(`
        INSERT INTO user (name, email, uf, password) 
        VALUES 
        ('Admin', '${USER_EMAIL}', 'SP', '${hashedPassword}')`
      , (err, result) => {
        if (err) throw err;
        console.log("\n inserted 'user' table data! [SUCCESS]");
        resolve();
      });
    });
  }),
  async () => new Promise((resolve, reject) => {
    // TABLE uf
    connection.query(`CREATE TABLE uf (
      id CHAR(2) NOT NULL PRIMARY KEY,
      name CHAR(255) NOT NULL
    )`, (err, result) => {
      if (err) throw err;
      console.log("\n Created 'uf' table! [SUCCESS]");
      let ufs = [
        {sigla: 'SP', name: 'São Paulo'},
        {sigla: 'RJ', name: 'Rio de Janeiro'},
        {sigla: 'MG', name: 'Minas Gerais'},
      ]
      .map(item => `('${item.sigla}', '${item.name}')`)
      .join(',');

      connection.query(`INSERT INTO uf (id, name) VALUES ${ufs}`, (err, result) => {
        if (err) throw err;
        console.log("\n inserted 'uf' table data! [SUCCESS]");
        resolve();
      });
    });
  }),
  async () => new Promise((resolve, reject) => {
    // TABLE categoria
    connection.query(`CREATE TABLE categoria (
      id SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      description VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL,
      image VARCHAR(1024) NOT NULL
    )`, (err, result) => {
      if (err) throw err;
      console.log("\n Created 'categoria' table! [SUCCESS]");

      let data = [
        {name: 'Bebês', slug: slugify('Bebês', {lower: true}), image: `http://localhost:${PORT}/images/bebes.gif`},
        {name: 'Carros', slug: slugify('Carros', {lower: true}), image: `http://localhost:${PORT}/images/carros.gif`},
        {name: 'Roupas', slug: slugify('Roupas', {lower: true}), image: `http://localhost:${PORT}/images/roupas.gif`},
        {name: 'Eletrônicos', slug: slugify('Eletrônicos', {lower: true}), image: `http://localhost:${PORT}/images/eletronicos.gif`},
      ]
      .map(item => `('${item.name}', '${item.slug}', '${item.image}')`)
      .join(',');

      connection.query(`INSERT INTO categoria (description, slug, image) VALUES ${data}`, (err, result) => {
        if (err) throw err;
        console.log("\n inserted 'categoria' table data! [SUCCESS]");
        resolve();
      });
    });
  }),
  async () => new Promise((resolve, reject) => {
    // TABLE Ad
    connection.query(`CREATE TABLE ad (
      id SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      user_id SMALLINT UNSIGNED NOT NULL,
      categoria_id SMALLINT UNSIGNED NOT NULL,
      title VARCHAR(100) NOT NULL,
      price FLOAT UNSIGNED DEFAULT 0,
      priceNegotiable TINYINT DEFAULT 0,
      date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      views SMALLINT UNSIGNED NOT NULL DEFAULT 0,
      description TEXT,
      CONSTRAINT fk_ad_user FOREIGN KEY (user_id) REFERENCES user (id),
      CONSTRAINT fk_ad_categoria FOREIGN KEY (categoria_id) REFERENCES categoria (id)
    )`, (err, result) => {
      if (err) throw err;
      console.log("\n Created 'ad' table! [SUCCESS]");

      let data = [
        {user_id: 1, categoria_id: 4, title: "Notebook Acer 18''", price: 1599, priceNegotiable: 1, description: 'Processador Intel Core i5-11400H - Six Core – 11ª Geração. GPU Nvidia GeForce GTX 1650 com 4 GB de memória dedicada GDDR6 TGP de 50W'},
        {user_id: 1, categoria_id: 4, title: "Notebook Acer 18''", price: 799, priceNegotiable: 0, description: 'Processador Intel Core i5-11400H - Six Core – 11ª Geração. GPU Nvidia GeForce GTX 1650 com 4 GB de memória dedicada GDDR6 TGP de 50W'},
        {user_id: 1, categoria_id: 4, title: "Notebook Acer 18''", price: 2000, priceNegotiable: 0, description: 'Processador Intel Core i5-11400H - Six Core – 11ª Geração. GPU Nvidia GeForce GTX 1650 com 4 GB de memória dedicada GDDR6 TGP de 50W'},
      ]
      .map(item => `(${item.user_id}, ${item.categoria_id}, '${item.title}', ${item.price}, ${item.priceNegotiable}, '${item.description}')`)
      .join(',');

      connection.query(`INSERT INTO ad (user_id, categoria_id, title, price, priceNegotiable, description) VALUES ${data}`, (err, result) => {
        if (err) throw err;
        console.log("\n inserted 'ad' table data! [SUCCESS]");
        resolve();
      });
    });
  }),
  async () => new Promise((resolve, reject) => {
    // TABLE ad_image
    connection.query(`CREATE TABLE ad_image (
      id SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
      ad_id SMALLINT UNSIGNED NOT NULL,
      image VARCHAR(1024) NOT NULL,
      CONSTRAINT fk_ad_image FOREIGN KEY (ad_id) REFERENCES ad (id)
    )`, (err, result) => {
      if (err) throw err;
      console.log("\n Created 'ad_image' table! [SUCCESS]");

      let data = [
        {ad_id: 1, image: `http://localhost:${PORT}/images/ads/notebook-1.gif`},
        {ad_id: 1, image: `http://localhost:${PORT}/images/ads/notebook-2.gif`},
        {ad_id: 2, image: `http://localhost:${PORT}/images/ads/notebook-2.gif`},
        {ad_id: 2, image: `http://localhost:${PORT}/images/ads/notebook-1.gif`},
        {ad_id: 3, image: `http://localhost:${PORT}/images/ads/notebook-1.gif`},
      ]
      .map(item => `(${item.ad_id}, '${item.image}')`)
      .join(',');

      connection.query(`INSERT INTO ad_image (ad_id, image) VALUES ${data}`, (err, result) => {
        if (err) throw err;
        console.log("\n inserted 'ad_image' table data! [SUCCESS]");
        resolve();
      });
    });
  }),
  async () => {
    // Finaliza a conexão
    // connection.end(err => {
    //   if (err) throw err;
    //   console.log('Conexão encerrada.');
    // });
  },
];

// inicializa scriptDB
(async () => { for (const fn of scriptDB) await fn() })();


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

    connection.query(sql, [email], (err, result) => {
      if (err) throw err;

      // Verifica se encontrou o e-mail do usuário
      if (!result.length) return res.status(401).json({ error: 'Email incorreto' });
      result = result[0];

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
  const values = [name, email, stateLoc, bcrypt.hashSync(password, 10)];
  const sql = 'INSERT INTO user (name, email, uf, password) VALUES (?, ?, ?, ?)';
  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    console.log(`Usuário: ${email} - criado com sucesso!`);
    // Gerar um token JWT
    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
    // Retornar o token JWT
    return res.json({ token });
  });
});

// endpoint estados
app.get('/api/uf', (req, res) => {
  const sql = 'SELECT * FROM uf';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// endpoint categoria
app.get('/api/categoria', (req, res) => {
  const sql = 'SELECT * FROM categoria';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// endpoint ads
app.get('/api/ads', (req, res) => {
  const sql = `
  SELECT a.*, ai.image 
  FROM olx.ad a 
  INNER JOIN olx.ad_image ai ON ai.ad_id = a.id 
  GROUP BY a.id`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
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
  connection.query(sql, [id], (err, result) => {
    if (err) throw err;
    if (result.length) {
      let data = {...result[0]};
      delete data.image;
      data.images = [];
      result.forEach(item => data.images.push(item.image));
      if (s == 1) {
        connection.query(`
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

app.post('/api/ad', verifyToken, upload.array('images', 5), (req, res) => {
  connection.query('SELECT id FROM user WHERE email = ?', [req.email], (err, result) => {
    if (err) throw err;
    if (result.length) {
      const { id } = result[0];
      const sql = 'INSERT INTO ad (user_id, categoria_id, title, price, priceNegotiable, description) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(sql, [id, req.body.category, req.body.title, Number(req.body.price.replace(',','.')), Number(req.body.priceNegotiable), req.body.description], (err, result) => {
        if (err) throw err;
        console.log(result);
        const ad_id = result.insertId;
        const values = [].map.call(req.files, img => `(${ad_id}, 'http://localhost:${PORT}/images/tmp/${img.filename}')`).join(',');
        connection.query(`INSERT INTO ad_image (ad_id, image) VALUES ${values}`, (err, result) => {
          if (err) throw err;
          res.json({id: ad_id, message: 'success'});
        });
      })
    } 
    else return res.status(500).json({ error: 'Erro Interno: Favor deslogar e logar novamente' });
  });
});


// endpoint protegido que só possa ser acessado com um token válido
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: `Bem-vindo(a), ${req.email}!` });
});

// Rota dinâmica que retorna dados do banco de dados em JSON
app.get('/dados/:id', (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM tabela WHERE id = ${id}`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
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