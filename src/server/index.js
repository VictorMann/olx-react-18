require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-aqui';

const USER_PASSWORD = process.env.USER_PASSWORD || '123'; 
const USER_EMAIL = process.env.USER_EMAIL || 'admin@admin.com';
const hashedPassword = bcrypt.hashSync(USER_PASSWORD, 10);


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

connection.query('CREATE DATABASE IF NOT EXISTS olx', (err, result) => {
  if (err) throw err;
  console.log("\nBanco OLX Criado com SUCESSO!");

  connection.query('USE olx', (err, result) => {
    if (err) throw err;
    
    connection.query('DROP TABLE IF EXISTS user', (err, result) => {
      connection.query(`
        CREATE TABLE IF NOT EXISTS olx.user (
          id SMALLINT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
          name VARCHAR(250) NOT NULL,
          email VARCHAR(250) NOT NULL,
          password VARCHAR(250) NOT NULL
        )`
      , (err, result) => {
        if (err) throw err;
        // console.log("\n", result);
    
        connection.query(`
          INSERT INTO user (name, email, password) 
          VALUES 
          ('Admin', '${USER_EMAIL}', '${hashedPassword}')`
        , (err, result) => {
          if (err) throw err;
          // console.log("\n", result);
  
          // Finaliza a conexão
          // connection.end(err => {
          //   if (err) throw err;
          //   console.log('Conexão encerrada.');
          // });
        });
      });
    });
  });
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
  
  const sql = `SELECT * FROM user WHERE email = '${email}' LIMIT 1`;

  try {

    connection.query(sql, (err, result) => {
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

// Inicie o servidor na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor Node.js em execução na porta ${PORT}!`);
});