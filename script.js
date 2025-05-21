
function checkAuth() {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);

    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
      userNameElement.innerHTML = userData.name + ' <i class="fas fa-chevron-down"></i>';
    }

    return true;
  }
  return false;
}

function gerarCodigoCertificado() {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CERT-${timestamp}-${random}`;
}
function formatarDataExtenso(data) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(data).toLocaleDateString('pt-BR', options);
}

function requireAuth() {
  const currentPage = window.location.pathname.split('/').pop();

  if (currentPage !== 'index.html' && currentPage !== 'register.html' && !checkAuth()) {
    window.location.href = 'index.html';
    return false;
  }

  if ((currentPage === 'index.html' || currentPage === 'register.html') && checkAuth()) {
    window.location.href = 'dashboard.html';
    return false;
  }

  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  if (!requireAuth()) {
    return;
  }

  setupSidebar();
  setupLogout();

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    setupLoginForm();
  }

  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    setupRegisterForm();
  }

  const novoCursoForm = document.getElementById('novoCursoForm');
  if (novoCursoForm) {
    setupNovoCursoForm();
  }

  const novoAlunoForm = document.getElementById('novoAlunoForm');
  if (novoAlunoForm) {
    setupNovoAlunoForm();
  }
  
  const alunosTable = document.getElementById('alunosTable');
  if (alunosTable) {
    carregarAlunos();
  }
  
  const emitirCertificadoForm = document.getElementById('emitirCertificadoForm');
  if (emitirCertificadoForm) {
    setupEmitirCertificadoForm();
  }
  
  if (window.location.pathname.includes('certificados.html')) {
    carregarCertificados();
  }
  if (window.location.pathname.includes('certificado-view.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const certificadoId = urlParams.get('id');
    if (certificadoId) {
      carregarCertificadoView(certificadoId);
    }
  }
});


function setupLoginForm() {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
      const user = {
        id: 1,
        name: 'Administrador',
        email: email,
        role: 'admin'
      };

      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    }
  });
}


function setupRegisterForm() {
  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (name && email && password) {
      const user = {
        id: 1,
        name: name,
        email: email,
        role: 'admin'
      };

      localStorage.setItem('user', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    }
  });
}


function setupNovoCursoForm() {
  document.getElementById('novoCursoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Curso cadastrado com sucesso!');
    window.location.href = 'cursos.html';
  });
}


function setupNovoAlunoForm() {
  const form = document.getElementById('novoAlunoForm');
  
  if (!form) {
    console.error("Formulário de novo aluno não encontrado!");
    return;
  }
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    console.log("Formulário de novo aluno enviado");
    
    
    const aluno = {
      id: Date.now(), 
      nome: document.getElementById('nomeAluno').value,
      cpf: document.getElementById('cpf').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      dataNascimento: document.getElementById('dataNascimento').value,
      endereco: document.getElementById('endereco').value,
      cidade: document.getElementById('cidade').value,
      estado: document.getElementById('estado').value,
      dataCadastro: new Date().toISOString()
    };
    
    console.log("Dados do aluno:", aluno);
    
  
    const cursosSelect = document.getElementById('cursos');
    aluno.cursos = [];
    
    if (cursosSelect) {
      for (let i = 0; i < cursosSelect.options.length; i++) {
        if (cursosSelect.options[i].selected) {
          aluno.cursos.push({
            id: cursosSelect.options[i].value,
            nome: cursosSelect.options[i].text
          });
        }
      }
    }
    

    try {
      let alunos = [];
      const alunosData = localStorage.getItem('alunos');
      
      if (alunosData) {
        alunos = JSON.parse(alunosData);
      }
      
      alunos.push(aluno);
      localStorage.setItem('alunos', JSON.stringify(alunos));
      console.log("Alunos salvos no localStorage:", alunos);
      
      alert('Aluno cadastrado com sucesso!');
      window.location.href = 'alunos.html';
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      alert('Erro ao cadastrar aluno. Verifique o console para mais detalhes.');
    }
  });
}


function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('user');
      window.location.href = 'index.html';
    });
  }
}


function carregarAlunos() {

  console.log("Carregando alunos do localStorage...");
  const alunosData = localStorage.getItem('alunos');
  console.log("Dados brutos:", alunosData);
  
  const alunos = alunosData ? JSON.parse(alunosData) : [];
  console.log("Alunos carregados:", alunos);
  
  const tbody = document.querySelector('#alunosTable tbody');
  if (!tbody) {
    console.error("Elemento tbody não encontrado!");
    return;
  }
  

  tbody.innerHTML = '';
  
  if (!alunos || alunos.length === 0) {
    console.log("Nenhum aluno encontrado");
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="5" class="text-center">Nenhum aluno cadastrado</td>';
    tbody.appendChild(tr);
    return;
  }
  

  alunos.forEach(aluno => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${aluno.nome || 'N/A'}</td>
      <td>${aluno.email || 'N/A'}</td>
      <td>${aluno.cpf || 'N/A'}</td>
      <td>${aluno.cursos ? aluno.cursos.length : 0}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon btn-edit" data-id="${aluno.id}"><i class="fas fa-edit"></i></button>
          <button class="btn-icon btn-delete" data-id="${aluno.id}"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const alunoId = parseInt(this.getAttribute('data-id'));
      excluirAluno(alunoId);
    });
  });
  
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const alunoId = parseInt(this.getAttribute('data-id'));
      window.location.href = `alunos-novo.html?id=${alunoId}`;
    });
  });
}


function excluirAluno(id) {
  if (confirm('Tem certeza que deseja excluir este aluno?')) {
    let alunos = JSON.parse(localStorage.getItem('alunos')) || [];
    alunos = alunos.filter(aluno => aluno.id !== id);
    localStorage.setItem('alunos', JSON.stringify(alunos));
    carregarAlunos();
    alert('Aluno excluído com sucesso!');
  }
}


function setupEmitirCertificadoForm() {
  const alunoSelect = document.getElementById('alunoSelect');
  const alunos = JSON.parse(localStorage.getItem('alunos')) || [];
  
  alunos.forEach(aluno => {
    const option = document.createElement('option');
    option.value = aluno.id;
    option.textContent = aluno.nome;
    alunoSelect.appendChild(option);
  });
  
  const cursoSelect = document.getElementById('cursoSelect');
  const cursos = [
    { id: 1, nome: 'Desenvolvimento Web', cargaHoraria: 60 },
    { id: 2, nome: 'UX/UI Design', cargaHoraria: 40 },
    { id: 3, nome: 'Python Avançado', cargaHoraria: 80 }
  ];
  
  cursos.forEach(curso => {
    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nome;
    cursoSelect.appendChild(option);
  });
  
  const dataEmissao = document.getElementById('dataEmissao');
  const hoje = new Date().toISOString().split('T')[0];
  dataEmissao.value = hoje;
  
  document.getElementById('emitirCertificadoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const alunoId = alunoSelect.value;
    const cursoId = cursoSelect.value;
    const dataEmissaoValue = dataEmissao.value;
    const modeloId = document.getElementById('modeloSelect').value;
    
    if (!alunoId || !cursoId || !dataEmissaoValue) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Encontrar aluno e curso
    const aluno = alunos.find(a => a.id == alunoId);
    const curso = cursos.find(c => c.id == cursoId);
    
    if (!aluno || !curso) {
      alert('Aluno ou curso não encontrado.');
      return;
    }
    
    const certificado = {
      id: Date.now(),
      alunoId: parseInt(alunoId),
      alunoNome: aluno.nome,
      cursoId: parseInt(cursoId),
      cursoNome: curso.nome,
      cargaHoraria: curso.cargaHoraria,
      dataEmissao: dataEmissaoValue,
      codigo: gerarCodigoCertificado(),
      modeloId: parseInt(modeloId),
      status: 'Emitido'
    };
    
    const certificados = JSON.parse(localStorage.getItem('certificados')) || [];
    certificados.push(certificado);
    localStorage.setItem('certificados', JSON.stringify(certificados));
    
    window.location.href = `certificado-view.html?id=${certificado.id}`;
  });
}

function carregarCertificados() {
  const certificados = JSON.parse(localStorage.getItem('certificados')) || [];
  const tbody = document.querySelector('table tbody');
  
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (certificados.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="6" class="text-center">Nenhum certificado emitido</td>';
    tbody.appendChild(tr);
    return;
  }
  
  certificados.forEach(certificado => {
    const tr = document.createElement('tr');
    const dataFormatada = new Date(certificado.dataEmissao).toLocaleDateString('pt-BR');
    
    tr.innerHTML = `
      <td>${certificado.alunoNome || 'N/A'}</td>
      <td>${certificado.cursoNome || 'N/A'}</td>
      <td>${dataFormatada}</td>
      <td>${certificado.codigo}</td>
      <td>${certificado.status}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon btn-view" data-id="${certificado.id}"><i class="fas fa-eye"></i></button>
          <button class="btn-icon btn-pdf" data-id="${certificado.id}"><i class="fas fa-file-pdf"></i></button>
          <button class="btn-icon btn-email" data-id="${certificado.id}"><i class="fas fa-envelope"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      window.location.href = `certificado-view.html?id=${id}`;
    });
  });
  
  document.querySelectorAll('.btn-pdf').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      alert('Funcionalidade de download de PDF será implementada em breve.');
    });
  });
  
  document.querySelectorAll('.btn-email').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      alert('Funcionalidade de envio por email será implementada em breve.');
    });
  });
}

function carregarCertificadoView(certificadoId) {
  const certificados = JSON.parse(localStorage.getItem('certificados')) || [];
  const certificado = certificados.find(c => c.id == certificadoId);
  
  if (!certificado) {
    alert('Certificado não encontrado!');
    window.location.href = 'certificados.html';
    return;
  }
  
  // Preencher os dados do certificado na visualização
  document.getElementById('certificadoAluno').textContent = certificado.alunoNome;
  document.getElementById('certificadoCurso').textContent = certificado.cursoNome;
  document.getElementById('certificadoCargaHoraria').textContent = certificado.cargaHoraria;
  document.getElementById('certificadoData').textContent = formatarDataExtenso(certificado.dataEmissao);
  document.getElementById('certificadoCodigo').textContent = `Código de Verificação: ${certificado.codigo}`;
  
  // Configurar botões de ação
  document.getElementById('downloadPDF').addEventListener('click', function() {
    alert('Funcionalidade de download de PDF será implementada em breve.');
  });
  
  document.getElementById('enviarEmail').addEventListener('click', function() {
    alert('Funcionalidade de envio por email será implementada em breve.');
  });
}

function setupSidebar() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }
}