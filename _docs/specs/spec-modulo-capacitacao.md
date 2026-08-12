# SPEC: Módulo de Controle de Capacitações

## 1. Especificação e Escopo
### 1.1. Business
A **CGE-MT - Controladoria Geral do Estado de Mato Grosso** é o órgão central de controle do estado. A CGE-MT é composta por um corpo de servidores e auditores. 

### 1.2. Motivação
Os _Auditores_ da **CGE-MT** tem a meta de realizar ao menos 40 horas de capacitação por ano. A __UDI - Unidade de Desenvolvimento Institucional_ da **CGE-MT** é responsável pelo acompanhamento das capacitações planejadas e realizadas pelos _Auditores_. Para tal, necessita de um sistema próprio para esse fim.

### 1.3. Requisitos de Negócio
- **Estrutura Organizacional**: A **CGE-MT** está organizada em ***Secretarias Adjuntas*** formadas por ***Superintendências***. Os _Auditores_ estão alocados nas superintendências. Cada superintendência é chefiada por um _Superintendente_.
  - CGE-MT -> Secretário -> Secretários Adjuntos -> Superintendentes -> Auditores.
- **Público Alvo**
  - **Auditores**: cadastrar os cursos.
  - **Superintendentes**: acompanhar o cadastramento e realização dos cursos.
  - **UDI**: emitir relatórios sazonais sobre a situação das capacitações.
- **Temas dos Cursos**: Temas prioritários definidos ***anualmente*** por **Portaria**.

### 1.4. Telas
✨  **1.4.1. Visão Geral**: A página principal do sistema mostra um quadro com as métricas individuais do Servidor, independentemente de ser _chefe de unidade_.
- Gráficos
  - Total de horas por mês: gráfico de barras mostrando o total de horas realizadas por mês.
  - Progresso Anual: Total de horas realizadas.
  - Total de Cursos Planejados
  - Horas que faltam realizar.
  
✨  **1.4.2. Lançamento de Cursos**: Tela acessível por menu e pelo quadro principal. É onde os servidores cadastram os seus cursos.
- Painéis
  - Lançamento de um novo curso.
- Tabelas
  - Cursos: todos os cursos do servidor/auditor.
  
✨  **1.4.3. Visão Gerencial**: tela em que o _chefe da unidade_ acompanha as métricas das unidades subordinadas a ele.
- Tabela
  - Temas mais cursados
  - Progresso dos Servidores: tabela com todos os servidores da unidade, contendo nome, categoria (auditor ou servidor), progresso (barra), horas realizadas e status. Botão para carregar o certificado.
- Gráficos
  - Progresso da Unidade: gráfico de colunas composto por trimestre.
  - Total de horas por unidade: gráfico de barras composto (horas planejadas e realizadas). Eixo horizontal contém a unidade e o eixo vertical o percentual.
  - Total de horas planejadas por macrofunção (auditoria, corregedoria, ouvidoria, especial, administrativo): gráfico de pizza.
  - Total de horas realizadas por macrofunção (auditoria, corregedoria, ouvidoria, especial, administrativo): gráfico de pizza.
  - Temas realizados versus planejado: gráfico de barras composto (realizado e planejado) por tema.

✨  **1.4.4. Temas Prioritários**
- Descrição: tabela e painel de cadastro de tema. 
- Tabela: mostra os temas por Portaria (caixa de seleção).

✨  **1.4.5. Servidores da Unidade**
- Descrição: tabela de todos os servidores/auditores selecionado por unidade. Mostra o chefe da unidade, com seu nome, email e matrícula.

## 2. Arquitetura
### 2.1. Models
✨  **2.1.1. Temas**  
**Tabela:** cap_temas.  
**Descrição:** Pré-carga de temas prioritários definidos por portaria.
| Atributo       | Tipo        | Descrição                                |
| -------------- | ----------- | -----------------------------------------|
| tema_id         | str         | ID do tema.    |
| mnemonico       | str         | Nome mnemonico do tema.    |
| descricao       | str         | Descrição do tema.    |
| portaria        | str         | A portaria que instituiu o tema.    |
| vigente         | bool        | Deleção lógica.       |
| created_at      | datetime    | Descrição do tema.    |
| updated_at      | datetime    | Última alteração.    |
| vigente_at      | datetime    | Vigente até a data (inclusive).   |

✨  **2.1.2. Cursos**  
**Tabela:** cap_cursos.
| Atributo       | Tipo        | Descrição                                |
| -------------- | ----------- | -----------------------------------------|
| curso_id       | str         | ID do curso.    |
| tema_id        | str         | ID do tema.    |
| nome           | str         | Nome mnemonico do curso.    |
| descricao      | str         | Descrição do curso.    |
| instituicao    | str         | Instituição ofertante do curso.    |
| unidade        | enum        | Mnemonico da unidade do auditor.   |
| auditor        | str         | Nome do auditor.      |
| hr_planejadas  | int         | Instituição ofertante do curso.    |
| hr_realizadas  | int         | Instituição ofertante do curso.    |

### 2.2. APIs de Carga de Dados
✨  **2.2.1. Dados do Servidor**  
- Descrição: retorna as informações cadastrais do servidor.
- Atributos: Nome, email, unidade.

✨  **2.2.2. Servidores da Unidade**  
- Descrição: retorna todos os servidores da unidade.
- Atributos: Lista de servidores. Cada servidor com o nome, email e matrícula.

✨  **2.2.3. Unidades Administrativas**  
- Descrição: retorna todas as unidades administrativas da CGE.
- Atributos: Lista de unidades. Cada unidade retornada contém o nome, mnemonico, nome do chefe da unidade, email do chefe da unidade e matrícula do chefe da unidade. Cada unidade tem a referência para a unidade superiora a que está vinculada. Cada unidade tem a sua macrofunção (auditoria, corregedoria, ouvidoria, etc).

### 2.3. Componentes
#### 2.3.1. Front-end
- **Responsabilidade**:
- **Colaboração**: comunica-se diretamente com os endpoints do microserviço `capacitacao`.
  - O ms `capacitacao` funciona com **BFF** do front-end.
- **Pasta**: `frontend`.
- **Linguagem**: `typescript`.
- **Tecnologia**: `react` + `tailwind`.

#### 2.3.2. Microserviço `capacitacao`
- **Responsabilidade**: 
- **Pasta**: `ms/capacitacao`.
- **Liguangem**: `python`.
- **Framework**: `fastapi`.
- **Design Patterns**
  - handlers: implementam a lógica recebimento e montagem dos dados da API.
  - services: implementam a lógica de negócios.
  - models: modelos e repositórios.
    - Repository: encapsula a lógica de persistência.

#### 2.3.3. Processamento de Dados
- **Responsabilidade**: extração de relatórios.
- **Pasta**: `process/capacitacao`.
- **Liguangem**: `python`.
- **Framework**: `prefect`.

## 3. Construção
### 3.1. Organização do Código Fonte (`udi/`)
```
udi/
├── config.py                           # Configurações globais e paths
├── telemetry.py                        # Logger unificado
├── frontend/                           # Frontend para todos os módulos
│   ├── ...
├── ms/                                 # Modulo de Capacitacao
│   ├── capacitacao/               
│   │   ├── handlers/                   # Handlers do `fastapi`
│   │   ├── services/                   # Serviços de negócio.
│   │   ├── persistence/
│   │   |   ├── temas_models.py         # Pydantic Models
│   │   |   ├── temas_repository.py     # Repositorios (interface e classe concreta)
├── process/                            # Processos batchs
│   ├── capacitacao/                    # Processos de extração de dados
├── scripts/                            # Ferramentas
│   ├── docker/                         
│   │   ├── local                       # Dockerfiles
│   ├── command/                        # REPL de administração
```

### 3.2 Ambientes
#### 3.2.1. Ambiente Local (desenvolvimento)
1. Docker compose para levantar a infraestrutura.
   - Pasta: `scripts/docker/local`.
   - docker.compose.frontend.yaml: frontend.
   - docker.compose.backend.yaml: microserviços.
   - docker.compose.services.yaml: banco de dados, mensageria, etc.
2. Banco de dados local `sqlite`.

#### 3.2.2. Ambiente de Produção
