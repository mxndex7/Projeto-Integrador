
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


function setupSidebar() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }
}