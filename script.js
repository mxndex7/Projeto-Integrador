// Função para gerar PDF do certificado
function gerarPDFCertificado(certificadoId) {
  const certificados = getAdminData('certificados');
  const certificado = certificados.find(c => c.id == certificadoId);
  
  if (!certificado) {
    alert('Certificado não encontrado!');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1123;
  canvas.height = 794;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.strokeStyle = '#2c5aa0';
  ctx.lineWidth = 15;
  ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
  
  ctx.fillStyle = '#2c5aa0';
  ctx.font = 'bold 48px serif';
  ctx.textAlign = 'center';
  ctx.fillText('CERTIFICADO', canvas.width / 2, 120);
  
  ctx.font = '24px serif';
  ctx.fillStyle = '#666666';
  ctx.fillText('DE CONCLUSÃO DE CURSO', canvas.width / 2, 160);
  
  ctx.font = '18px serif';
  ctx.fillStyle = '#333333';
  ctx.fillText('Certificamos que', canvas.width / 2, 220);
  
  ctx.font = 'bold 32px serif';
  ctx.fillStyle = '#2c5aa0';
  ctx.fillText(certificado.alunoNome.toUpperCase(), canvas.width / 2, 280);
  
  ctx.strokeStyle = '#2c5aa0';
  ctx.lineWidth = 2;
  const nomeWidth = ctx.measureText(certificado.alunoNome.toUpperCase()).width;
  ctx.beginPath();
  ctx.moveTo((canvas.width - nomeWidth) / 2, 290);
  ctx.lineTo((canvas.width + nomeWidth) / 2, 290);
  ctx.stroke();
  
  ctx.font = '18px serif';
  ctx.fillStyle = '#333333';
  ctx.fillText('concluiu com sucesso o curso de', canvas.width / 2, 340);
  
  ctx.font = 'bold 24px serif';
  ctx.fillStyle = '#d4850c';
  ctx.fillText(certificado.cursoNome, canvas.width / 2, 380);
  
  ctx.font = '18px serif';
  ctx.fillStyle = '#333333';
  ctx.fillText(`com carga horária de ${certificado.cargaHoraria} horas.`, canvas.width / 2, 420);
  
  ctx.font = '16px serif';
  ctx.fillStyle = '#666666';
  ctx.fillText(formatarDataExtenso(certificado.dataEmissao), canvas.width / 2, 500);
  
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 150, 580);
  ctx.lineTo(canvas.width / 2 + 150, 580);
  ctx.stroke();
  
  ctx.font = '14px serif';
  ctx.fillStyle = '#666666';
  ctx.fillText('Assinatura do Responsável', canvas.width / 2, 600);
  
  ctx.strokeStyle = '#d4850c';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(canvas.width - 150, 150, 50, 0, 2 * Math.PI);
  ctx.stroke();
  
  ctx.font = 'bold 12px serif';
  ctx.fillStyle = '#d4850c';
  ctx.textAlign = 'center';
  ctx.fillText('CERTYHUB', canvas.width - 150, 145);
  ctx.fillText('CERTIFICAÇÃO', canvas.width - 150, 160);
  
  ctx.font = '12px serif';
  ctx.fillStyle = '#666666';
  ctx.textAlign = 'center';
  ctx.fillText(`Código de Verificação: ${certificado.codigo}`, canvas.width / 2, canvas.height - 30);
  
  canvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificado-${certificado.alunoNome.replace(/\s+/g, '-').toLowerCase()}-${certificado.codigo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Certificado baixado com sucesso!');
  }, 'image/pdf');
}



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

function validarCPF(cpf) {
  // Remove caracteres não numéricos
  const cpfNumeros = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpfNumeros.length !== 11) {
    return false;
  }
  
  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpfNumeros)) {
    return false;
  }
  
  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfNumeros.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfNumeros.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfNumeros.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfNumeros.charAt(10))) return false;
  
  return true;
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
  
  // Páginas que não precisam de autenticação
  const publicPages = ['index.html', 'validacao.html', 'register.html'];

  if (!publicPages.includes(currentPage) && !checkAuth()) {
    window.location.href = 'index.html';
    return false;
  }

  if (currentPage === 'index.html' && checkAuth()) {
    window.location.href = 'dashboard.html';
    return false;
  }

  return true;
}

// Funções para isolamento de dados por admin
function getAdminDataKey(dataType) {
  const currentAdminId = localStorage.getItem('currentAdminId') || 'admin';
  return `${dataType}_${currentAdminId}`;
}

function getAdminData(dataType) {
  const key = getAdminDataKey(dataType);
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setAdminData(dataType, data) {
  const key = getAdminDataKey(dataType);
  localStorage.setItem(key, JSON.stringify(data));
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
  
  if (window.location.pathname.includes('dashboard.html')) {
    carregarDashboardEstatisticas();
    carregarCertificadosRecentes();
  }
  
  if (window.location.pathname.includes('cursos.html')) {
    carregarCursos();
  }
});


function setupLoginForm() {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Buscar administradores cadastrados
    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    
    // Verificar admin padrão
    if (username === 'admin' && password === '123456') {
      const user = {
        id: 'admin',
        name: 'Administrador Principal',
        username: 'admin',
        role: 'admin'
      };

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('currentAdminId', 'admin');
      window.location.href = 'dashboard.html';
      return;
    }

    // Verificar admin cadastrado
    const admin = admins.find(a => a.username === username && a.password === password);
    if (admin) {
      const user = {
        id: admin.id,
        name: admin.name,
        username: admin.username,
        role: 'admin'
      };

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('currentAdminId', admin.id);
      window.location.href = 'dashboard.html';
    } else {
      alert('Credenciais inválidas!');
    }
  });
}

function setupRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    const admins = JSON.parse(localStorage.getItem('admins')) || [];
    
    // Verificar se já existe admin com esse email
    if (admins.find(a => a.username === email)) {
      alert('Já existe um administrador com este usuário!');
      return;
    }

    const newAdmin = {
      id: Date.now().toString(),
      name: name,
      username: email,
      password: password,
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    localStorage.setItem('admins', JSON.stringify(admins));

    alert('Administrador cadastrado com sucesso!');
    window.location.href = 'index.html';
  });
}





function setupNovoCursoForm() {
  // Verificar se é edição
  const urlParams = new URLSearchParams(window.location.search);
  const cursoId = urlParams.get('id');
  
  if (cursoId) {
    const cursos = getAdminData('cursos');
    const curso = cursos.find(c => c.id == cursoId);
    
    if (curso) {
      document.getElementById('nomeCurso').value = curso.nome;
      document.getElementById('cargaHoraria').value = curso.cargaHoraria;
      document.getElementById('responsavel').value = curso.responsavel;
      document.getElementById('descricao').value = curso.descricao;
      document.getElementById('dataInicio').value = curso.dataInicio;
      document.getElementById('dataFim').value = curso.dataFim;
      document.getElementById('modeloCertificado').value = curso.modeloCertificado;
      
      document.querySelector('.header-actions h2').textContent = 'Editar Curso';
      document.querySelector('.dashboard-title').textContent = 'Editar Curso';
      document.querySelector('button[type="submit"]').textContent = 'Atualizar Curso';
    }
  }
  
  document.getElementById('novoCursoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const curso = {
      id: cursoId ? parseInt(cursoId) : Date.now(),
      nome: document.getElementById('nomeCurso').value,
      cargaHoraria: document.getElementById('cargaHoraria').value,
      responsavel: document.getElementById('responsavel').value,
      descricao: document.getElementById('descricao').value,
      dataInicio: document.getElementById('dataInicio').value,
      dataFim: document.getElementById('dataFim').value,
      modeloCertificado: document.getElementById('modeloCertificado').value,
      status: 'Ativo'
    };
    
    let cursos = getAdminData('cursos');
    
    if (cursoId) {
      // Editar curso existente
      const index = cursos.findIndex(c => c.id == cursoId);
      if (index !== -1) {
        cursos[index] = curso;
      }
      alert('Curso atualizado com sucesso!');
    } else {
      // Adicionar novo curso
      cursos.push(curso);
      alert('Curso cadastrado com sucesso!');
    }
    
    setAdminData('cursos', cursos);
    window.location.href = 'cursos.html';
  });
}


function setupNovoAlunoForm() {
  const form = document.getElementById('novoAlunoForm');
  if (!form) return;
  
  const cursosSelect = document.getElementById('cursos');
  let cursosDisponiveis = getAdminData('cursos');
  
  if (cursosDisponiveis.length === 0) {
    cursosDisponiveis = [
      { id: 1, nome: 'Desenvolvimento Front End' },
      { id: 2, nome: 'Desenvolvimento Back End' },
      { id: 3, nome: 'Desenvolvimento Full Stack' }
    ];
    setAdminData('cursos', cursosDisponiveis);
  }
  
  cursosDisponiveis.forEach(curso => {
    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nome;
    cursosSelect.appendChild(option);
  });
  
  const urlParams = new URLSearchParams(window.location.search);
  const alunoId = urlParams.get('id');
  
  if (alunoId) {
    const alunos = getAdminData('alunos');
    const aluno = alunos.find(a => a.id == alunoId);
    
    if (aluno) {
      document.getElementById('nomeAluno').value = aluno.nome;
      document.getElementById('cpf').value = aluno.cpf;
      document.getElementById('email').value = aluno.email;
      document.getElementById('telefone').value = aluno.telefone;
      document.getElementById('dataNascimento').value = aluno.dataNascimento;
      document.getElementById('endereco').value = aluno.endereco;
      document.getElementById('cidade').value = aluno.cidade;
      document.getElementById('estado').value = aluno.estado;
      
      if (aluno.cursos) {
        aluno.cursos.forEach(curso => {
          const option = cursosSelect.querySelector(`option[value="${curso.id}"]`);
          if (option) option.selected = true;
        });
      }
      
      document.querySelector('.header-actions h2').textContent = 'Editar Aluno';
      document.querySelector('.dashboard-title').textContent = 'Editar Aluno';
      document.querySelector('button[type="submit"]').textContent = 'Atualizar Aluno';
    }
  }
  
  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length <= 11) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      
      e.target.value = value;
    });
  }
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cpfValue = document.getElementById('cpf').value;
    if (!validarCPF(cpfValue)) {
      alert('CPF inválido! O CPF deve ter o formato XXX.XXX.XXX-XX com 11 dígitos.');
      return;
    }
    
    const aluno = {
      id: alunoId ? parseInt(alunoId) : Date.now(), 
      nome: document.getElementById('nomeAluno').value,
      cpf: document.getElementById('cpf').value,
      email: document.getElementById('email').value,
      telefone: document.getElementById('telefone').value,
      dataNascimento: document.getElementById('dataNascimento').value,
      endereco: document.getElementById('endereco').value,
      cidade: document.getElementById('cidade').value,
      estado: document.getElementById('estado').value,
      dataCadastro: alunoId ? (getAdminData('alunos').find(a => a.id == alunoId)?.dataCadastro || new Date().toISOString()) : new Date().toISOString(),
      cursos: []
    };
    
    for (let i = 0; i < cursosSelect.options.length; i++) {
      if (cursosSelect.options[i].selected) {
        aluno.cursos.push({
          id: cursosSelect.options[i].value,
          nome: cursosSelect.options[i].text
        });
      }
    }
    
    let alunos = getAdminData('alunos');
    
    if (alunoId) {
      const index = alunos.findIndex(a => a.id == alunoId);
      if (index !== -1) alunos[index] = aluno;
      alert('Aluno atualizado com sucesso!');
    } else {
      alunos.push(aluno);
      alert('Aluno cadastrado com sucesso!');
    }
    
    setAdminData('alunos', alunos);
    window.location.href = 'alunos.html';
  });
}


function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('user');
      localStorage.removeItem('currentAdminId');
      window.location.href = 'index.html';
    });
  }
}


function carregarAlunos() {
  const alunos = getAdminData('alunos');
  const tbody = document.querySelector('#alunosTable tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (!alunos || alunos.length === 0) {
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
    let alunos = getAdminData('alunos');
    alunos = alunos.filter(aluno => aluno.id !== id);
    setAdminData('alunos', alunos);
    carregarAlunos();
    alert('Aluno excluído com sucesso!');
  }
}


function setupEmitirCertificadoForm() {
  const alunoSelect = document.getElementById('alunoSelect');
  const cursoSelect = document.getElementById('cursoSelect');

  if (!alunoSelect || !cursoSelect) {
    console.error('Elementos do formulário não encontrados');
    return;
  }

  const alunos = getAdminData('alunos');

  // Limpar opções existentes
  alunoSelect.innerHTML = '<option value="">Selecione um aluno</option>';
  cursoSelect.innerHTML = '<option value="">Selecione um curso</option>';

  alunos.forEach(aluno => {
    const option = document.createElement('option');
    option.value = aluno.id;
    option.textContent = aluno.nome;
    alunoSelect.appendChild(option);
  });

  let cursos = getAdminData('cursos');

  if (cursos.length === 0) {
    cursos = [
      { id: 1, nome: 'Desenvolvimento Front End', cargaHoraria: 60 },
      { id: 2, nome: 'Desenvolvimento Back End', cargaHoraria: 40 },
      { id: 3, nome: 'Desenvolvimento Full Stack', cargaHoraria: 80 }
    ];
    setAdminData('cursos', cursos);
  } else {
    cursos = cursos.map(curso => ({
      ...curso,
      cargaHoraria: parseInt(curso.cargaHoraria) || 0
    }));
  }

  cursos.forEach(curso => {
    const option = document.createElement('option');
    option.value = curso.id;
    option.textContent = curso.nome;
    cursoSelect.appendChild(option);
  });

  const dataEmissao = document.getElementById('dataEmissao');
  dataEmissao.value = new Date().toISOString().split('T')[0];

  const form = document.getElementById('emitirCertificadoForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const alunoId = alunoSelect.value;
      const cursoId = cursoSelect.value;
      const dataEmissaoValue = document.getElementById('dataEmissao').value;
      const modeloSelect = document.getElementById('modeloSelect');
      const modeloId = modeloSelect ? modeloSelect.value : '1';

      if (!alunoId || !cursoId || !dataEmissaoValue) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

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

      const certificados = getAdminData('certificados');
      certificados.push(certificado);
      setAdminData('certificados', certificados);

      alert('Certificado emitido com sucesso!');
      window.location.href = `certificado-view.html?id=${certificado.id}`;
    });
  }
}

function carregarCertificados() {
  const certificados = getAdminData('certificados');
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
      gerarPDFCertificado(id);
    });
  });
}

function carregarCertificadoView(certificadoId) {
  const certificados = getAdminData('certificados');
  const certificado = certificados.find(c => c.id == certificadoId);
  
  if (!certificado) {
    alert('Certificado não encontrado!');
    window.location.href = 'certificados.html';
    return;
  }
  
  document.getElementById('certificadoAluno').textContent = certificado.alunoNome;
  document.getElementById('certificadoCurso').textContent = certificado.cursoNome;
  document.getElementById('certificadoCargaHoraria').textContent = certificado.cargaHoraria;
  document.getElementById('certificadoData').textContent = formatarDataExtenso(certificado.dataEmissao);
  document.getElementById('certificadoCodigo').textContent = `Código de Verificação: ${certificado.codigo}`;
  
  document.getElementById('downloadPDF').addEventListener('click', function() {
    gerarPDFCertificado(certificadoId);
  });
}

function carregarDashboardEstatisticas() {
  const alunos = getAdminData('alunos');
  const certificados = getAdminData('certificados');
  
  const totalAlunos = alunos.length;
  const totalCertificados = certificados.length;
  
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();
  
  const certificadosEstesMes = certificados.filter(cert => {
    const dataCert = new Date(cert.dataEmissao);
    return dataCert.getMonth() === mesAtual && dataCert.getFullYear() === anoAtual;
  }).length;
  
  const totalAlunosEl = document.getElementById('totalAlunos');
  const totalCertificadosEl = document.getElementById('totalCertificados');
  const certificadosEsteMesEl = document.getElementById('certificadosEstesMes');
  
  if (totalAlunosEl) totalAlunosEl.textContent = totalAlunos;
  if (totalCertificadosEl) totalCertificadosEl.textContent = totalCertificados;
  if (certificadosEsteMesEl) certificadosEsteMesEl.textContent = certificadosEstesMes;
}

function carregarCertificadosRecentes() {
  const certificados = getAdminData('certificados');
  const tbody = document.getElementById('certificadosRecentesTable');
  
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (certificados.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="5" class="text-center">Nenhum certificado emitido</td>';
    tbody.appendChild(tr);
    return;
  }
  
  const certificadosRecentes = certificados
    .sort((a, b) => new Date(b.dataEmissao) - new Date(a.dataEmissao))
    .slice(0, 5);
  
  certificadosRecentes.forEach(certificado => {
    const tr = document.createElement('tr');
    const dataFormatada = new Date(certificado.dataEmissao).toLocaleDateString('pt-BR');
    
    tr.innerHTML = `
      <td>${certificado.alunoNome || 'N/A'}</td>
      <td>${certificado.cursoNome || 'N/A'}</td>
      <td>${dataFormatada}</td>
      <td>${certificado.codigo}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon btn-edit" onclick="window.location.href='certificado-view.html?id=${certificado.id}'">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-icon btn-edit" onclick="gerarPDFCertificado(${certificado.id})">
            <i class="fas fa-file-pdf"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function carregarCursos() {
  let cursos = getAdminData('cursos');
  
  // Se não há cursos salvos, usar os padrões
  if (cursos.length === 0) {
    cursos = [
      {
        id: 1,
        nome: 'Desenvolvimento Front End',
        cargaHoraria: '60',
        responsavel: 'Professor Renan',
        status: 'Ativo',
        descricao: 'Curso de desenvolvimento frontend',
        dataInicio: '2024-01-01',
        dataFim: '2024-03-01',
        modeloCertificado: '1'
      },
      {
        id: 2,
        nome: 'Desenvolvimento Back End',
        cargaHoraria: '40',
        responsavel: 'Professor Costa',
        status: 'Ativo',
        descricao: 'Curso de desenvolvimento backend',
        dataInicio: '2024-02-01',
        dataFim: '2024-04-01',
        modeloCertificado: '1'
      },
      {
        id: 3,
        nome: 'Desenvolvimento Full Stack',
        cargaHoraria: '80',
        responsavel: 'Professor Alencar',
        status: 'Ativo',
        descricao: 'Curso de desenvolvimento fullstack',
        dataInicio: '2024-03-01',
        dataFim: '2024-06-01',
        modeloCertificado: '1'
      }
    ];
    setAdminData('cursos', cursos);
  }
  
  const tbody = document.querySelector('table tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  cursos.forEach(curso => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${curso.nome}</td>
      <td>${curso.cargaHoraria}h</td>
      <td>${curso.responsavel}</td>
      <td>${curso.status}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon btn-edit" data-id="${curso.id}"><i class="fas fa-edit"></i></buttonbutton>
          <button class="btn-icon btn-delete" data-id="${curso.id}"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  // Adicionar event listeners
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const cursoId = this.getAttribute('data-id');
      window.location.href = `cursos-novo.html?id=${cursoId}`;
    });
  });
  
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const cursoId = parseInt(this.getAttribute('data-id'));
      excluirCurso(cursoId);
    });
  });
}

function excluirCurso(id) {
  if (confirm('Tem certeza que deseja excluir este curso?')) {
    let cursos = getAdminData('cursos');
    cursos = cursos.filter(curso => curso.id !== id);
    setAdminData('cursos', cursos);
    carregarCursos();
    alert('Curso excluído com sucesso!');
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

// Function to validate certificate by code
function validarCertificado() {
  const codigo = document.getElementById('codigoCertificado').value;

  if (!codigo) {
    alert('Por favor, insira o código do certificado.');
    return;
  }

  // Buscar certificado em todos os admins
  let certificado = null;
  const admins = JSON.parse(localStorage.getItem('admins')) || [];

  // Verificar certificados do admin principal
  const certificadosAdmin = JSON.parse(localStorage.getItem('certificados_admin')) || [];
  certificado = certificadosAdmin.find(cert => cert.codigo === codigo);

  // Se não encontrou, verificar certificados de outros admins
  if (!certificado) {
    for (const admin of admins) {
      const certificadosAdminEspecifico = JSON.parse(localStorage.getItem(`certificados_${admin.id}`)) || [];
      certificado = certificadosAdminEspecifico.find(cert => cert.codigo === codigo);
      if (certificado) break;
    }
  }

  if (certificado) {
    document.getElementById('resultadoValidacao').innerHTML = `
      <div class="alert alert-success" role="alert">
        Certificado válido!
        <p><strong>Aluno:</strong> ${certificado.alunoNome}</p>
        <p><strong>Curso:</strong> ${certificado.cursoNome}</p>
        <p><strong>Data de Emissão:</strong> ${formatarDataExtenso(certificado.dataEmissao)}</p>
      </div>
    `;
  } else {
    document.getElementById('resultadoValidacao').innerHTML = `
      <div class="alert alert-danger" role="alert">
        Certificado inválido.
      </div>
    `;
  }
}