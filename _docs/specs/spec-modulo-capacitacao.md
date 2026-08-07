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
✨  **1.4.1. Quadro Principal**: A página principal do sistema mostra um quadro com as métricas da área e as informações de capacitação do auditor.  
- Tabelas
- Gráficos

✨  **1.4.2. Lançamento de Cursos**: Tela acessível por menu e pelo quadro principal. É onde os auditores cadastram os seus cursos.

✨  **1.4.3. Acompanhamento da Superintendência**: tela em que o _superintendente_ acompanha as métricas da sua unidade.

✨  **1.4.4. Menus e Navegação**

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
| deleted         | bool        | Deleção lógica.       |
| created_at      | datetime    | Descrição do tema.    |
| updated_at      | datetime    | Descrição do tema.    |
| deleted_at      | datetime    | Descrição do tema.    |

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

### 2.2. Componentes
#### 2.2.1. Front-end
- **Responsabilidade**:
- **Colaboração**: comunica-se diretamente com os endpoints do microserviço `capacitacao`.
  - O ms `capacitacao` funciona com **BFF** do front-end.
- **Pasta**: `frontend`.
- **Linguagem**: `typescript`.
- **Tecnologia**: `react` + `tailwind`.

#### 2.2.2. Microserviço `capacitacao`
- **Responsabilidade**: 
- **Pasta**: `ms/capacitacao`.
- **Liguangem**: `python`.
- **Framework**: `fastapi`.
- **Design Patterns**
  - handlers: implementam a lógica recebimento e montagem dos dados da API.
  - services: implementam a lógica de negócios.
  - models: modelos e repositórios.
    - Repository: encapsula a lógica de persistência.

#### 2.2.3. Processamento de Dados
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
