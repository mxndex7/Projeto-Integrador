
# CertyHub - Sistema de Certificados

![CertyHub Logo](https://img.shields.io/badge/CertyHub-Certificados-blue?style=for-the-badge&logo=certificate)

Um sistema web completo para gerenciamento e emissão de certificados de cursos, desenvolvido com HTML, CSS e JavaScript vanilla.

## 🚀 Funcionalidades

### ✅ Funcionalidades Implementadas

- **🔐 Sistema de Autenticação**
  - Login administrativo
  - Cadastro de novos administradores
  - Proteção de rotas

- **📚 Gerenciamento de Cursos**
  - Cadastro de novos cursos
  - Edição de cursos existentes
  - Exclusão de cursos
  - Listagem com filtros

- **👥 Gerenciamento de Alunos**
  - Cadastro completo de alunos
  - Edição de dados dos alunos
  - Exclusão de alunos
  - Validação de CPF
  - Vinculação a múltiplos cursos

- **🏆 Sistema de Certificados**
  - Emissão automática de certificados
  - Download em PDF
  - Código único de verificação
  - Histórico completo

- **✅ Validação Pública**
  - Página de validação de certificados
  - Verificação por código único
  - Acesso sem autenticação

- **📊 Dashboard Administrativo**
  - Estatísticas em tempo real
  - Certificados recentes
  - Métricas de alunos e cursos

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Armazenamento:** LocalStorage
- **Ícones:** Font Awesome 6.2.0
- **Fontes:** Google Fonts (Montserrat)
- **PDF:** Canvas API para geração

## 🏗️ Estrutura do Projeto

```
certyhub/
├── index.html              # Página de login
├── register.html           # Página de cadastro
├── dashboard.html          # Dashboard principal
├── cursos.html            # Listagem de cursos
├── cursos-novo.html       # Cadastro/edição de cursos
├── alunos.html            # Listagem de alunos
├── alunos-novo.html       # Cadastro/edição de alunos
├── certificados.html      # Listagem de certificados
├── certificados-emitir.html # Emissão de certificados
├── certificado-view.html  # Visualização de certificado
├── validacao.html         # Validação pública
├── modelo-dados.html      # Documentação do modelo
├── script.js              # Lógica principal
├── style.css              # Estilos globais
└── README.md              # Este arquivo
```

### Credenciais Padrão

- **Usuário:** `admin`
- **Senha:** `123456`

## 📋 Modelo de Dados

### Aluno
```javascript
{
  id: Integer,
  nome: String,
  cpf: String,
  email: String,
  telefone: String,
  dataNascimento: Date,
  endereco: String,
  cidade: String,
  estado: String,
  dataCadastro: DateTime,
  cursos: Array
}
```

### Curso
```javascript
{
  id: Integer,
  nome: String,
  cargaHoraria: Integer,
  responsavel: String,
  descricao: String,
  dataInicio: Date,
  dataFim: Date,
  modeloCertificado: String,
  status: String
}
```

### Certificado
```javascript
{
  id: Integer,
  alunoId: Integer,
  alunoNome: String,
  cursoId: Integer,
  cursoNome: String,
  cargaHoraria: Integer,
  dataEmissao: Date,
  codigo: String,
  modeloId: Integer,
  status: String
}
```

## 🎯 Como Usar

### 1. Primeiro Acesso
1. Acesse a página inicial (`index.html`)
2. Faça login com `admin` / `123456`
3. Ou crie uma nova conta administrativa

### 2. Cadastrar Cursos
1. Acesse **Cursos** no menu lateral
2. Clique em **"Novo Curso"**
3. Preencha os dados e salve

### 3. Cadastrar Alunos
1. Acesse **Alunos** no menu lateral
2. Clique em **"Novo Aluno"**
3. Preencha todos os campos obrigatórios
4. Selecione os cursos do aluno

### 4. Emitir Certificados
1. Acesse **Certificados** no menu lateral
2. Clique em **"Emitir Certificado"**
3. Selecione o aluno e curso
4. Define a data de emissão
5. O certificado será gerado automaticamente

### 5. Validar Certificados
1. Acesse `validacao.html` (público)
2. Digite o código do certificado
3. Visualize os dados de validação

## 🔧 Funcionalidades Técnicas

### Validações
- **CPF:** Validação completa com dígitos verificadores
- **Formulários:** Validação client-side em tempo real
- **Autenticação:** Proteção de rotas administrativas

### Responsividade
- Design responsivo para desktop e mobile
- Menu lateral adaptativo
- Tabelas com scroll horizontal

### Armazenamento
- Dados persistidos no LocalStorage
- Estrutura JSON organizada
- Backup automático dos dados

## 🎨 Interface

### Tema Dark
- Paleta de cores moderna
- Alto contraste para acessibilidade
- Ícones intuitivos

### Componentes
- Cards estatísticos no dashboard
- Tabelas interativas
- Formulários responsivos
- Modais de confirmação

## 🔐 Segurança

### Implementado
- Autenticação básica
- Proteção de rotas administrativas
- Validação de dados no frontend

### Recomendações para Produção
- Implementar backend com autenticação JWT
- Criptografia de senhas
- Validação server-side
- Rate limiting
- HTTPS obrigatório

## 📱 Páginas Públicas

- **Validação de Certificados** (`validacao.html`)
  - Não requer autenticação
  - Interface limpa e focada
  - Verificação em tempo real
 
## Demonstração

O site pode ser visualizado em: https://certyhubsite.netlify.app/

## 🐛 Limitações Conhecidas

- Armazenamento limitado ao LocalStorage
- Sem persistência em servidor
- Autenticação básica (não production-ready)
- Sem backup automático

## 👨‍💻 Desenvolvimento

### Estrutura do Código
- **script.js:** Lógica principal e manipulação do DOM
- **style.css:** Estilos globais e componentes
- **HTML:** Páginas estruturadas e semânticas

### Padrões Utilizados
- JavaScript ES6+
- CSS Grid e Flexbox
- Nomenclatura BEM para CSS
- Separação de responsabilidades

## Desenvolvedor

Desenvolvido por Guilherme Mendes - Projeto Integrador.

---

⭐ Se gostou deste projeto, não se esqueça de dar uma estrela no repositório!

