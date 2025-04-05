// Definição dos tipos para os elementos de despesa
export interface ExpenseElement {
    id: string
    name: string
    category: string
    subcategory?: string
  }
  
  // Categorias principais
  export type ExpenseCategory =
    | "MATERIAL DE CONSUMO"
    | "EQUIP E MAT PERMANENTE"
    | "ELEMENTO NÃO DEFINIDO"
    | "SERVIÇOS DE TERCEIROS"
    | "OUTROS MATERIAIS"
    | "OUTROS"
  
  // Lista completa de elementos de despesa baseada nas imagens fornecidas
  export const expenseElements: ExpenseElement[] = [
    // Elementos não definidos
    {
      id: "elemento-nao-definido",
      name: "ELEMENTO NÃO DEFINIDO",
      category: "ELEMENTO NÃO DEFINIDO",
      subcategory: "COMPRA DE MATERIAL OU PRESTAÇÃO DE SERVIÇOS",
    },
  
    // Materiais de consumo
    {
      id: "material-consumo",
      name: "MATERIAL DE CONSUMO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-higiene-limpeza",
      name: "MATERIAL DE HIGIENE E LIMPEZA",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-expediente",
      name: "MATERIAL DE EXPEDIENTE",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-copa-cozinha",
      name: "MATERIAL DE COPA E COZINHA",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-construcao-geral",
      name: "MATERIAL DE CONSTRUÇÃO EM GERAL",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-construcao-eletrico",
      name: "MATERIAL DE CONSTRUÇÃO / ELÉTRICO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-construcao-hidraulico",
      name: "MATERIAL DE CONSTRUÇÃO / HIDRÁULICO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-construcao-madeira",
      name: "MATERIAL DE CONSTRUÇÃO / MADEIRA",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-construcao-pintura",
      name: "MATERIAL DE CONSTRUÇÃO / PINTURA",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-cama-mesa-banho",
      name: "MATERIAL DE CAMA, MESA E BANHO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-informatica-processamento",
      name: "MATERIAL DE INFORMÁTICA E PROCESSAMENTO DE DADOS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-protecao-seguranca",
      name: "MATERIAL DE PROTEÇÃO E SEGURANÇA",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-manobra-patrulhamento",
      name: "MATERIAL DE MANOBRA E PATRULHAMENTO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-acondicionamento-embalagem",
      name: "MATERIAL DE ACONDICIONAMENTO E EMBALAGEM",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-educativo-didatico",
      name: "MATERIAL EDUCATIVO / DIDÁTICO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-esportivo",
      name: "MATERIAL ESPORTIVO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-artesanato",
      name: "MATERIAL DE ARTESANATO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-medicamento-veterinario",
      name: "MATERIAL E MEDICAMENTO PARA USO VETERINÁRIO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-biologico",
      name: "MATERIAL BIOLÓGICO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-distribuicao-gratuita",
      name: "MATERIAL, BEM OU SERVIÇO PARA DISTRIBUIÇÃO GRATUITA",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "generos-alimentacao",
      name: "GÊNEROS DE ALIMENTAÇÃO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "generos-alimentacao-dietas",
      name: "GÊNEROS DE ALIMENTAÇÃO (DIETAS E SUPLEMENTOS)",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "combustiveis-automotivos",
      name: "COMBUSTÍVEIS AUTOMOTIVOS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "gas-engarrafado",
      name: "GÁS ENGARRAFADO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "ferramentas-consumo",
      name: "FERRAMENTAS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "fraldas",
      name: "FRALDAS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "brinquedos-consumo",
      name: "BRINQUEDOS",
      category: "MATERIAL DE CONSUMO",
    },
    // Novos materiais de consumo
    {
      id: "material-farmacologico",
      name: "MATERIAL FARMACOLÓGICO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-grafico",
      name: "MATERIAL GRÁFICO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-hospitalar-enfermagem",
      name: "MATERIAL HOSPITALAR E ENFERMAGEM",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-laboratorial",
      name: "MATERIAL LABORATORIAL",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-odontologico",
      name: "MATERIAL ODONTOLÓGICO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-audio-video-foto",
      name: "MATERIAL PARA ÁUDIO, VÍDEO E FOTO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-comunicacoes",
      name: "MATERIAL PARA COMUNICAÇÕES",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-festividades-homenagens",
      name: "MATERIAL P/ FESTIVIDADES E HOMENAGENS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-manut-veiculos-baterias",
      name: "MATERIAL P/ MANUT VEÍCULOS / BATERIAS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-manut-veiculos-filtros",
      name: "MATERIAL P/ MANUT VEÍCULOS / FILTROS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-manut-veiculos-lubrificantes",
      name: "MATERIAL P/ MANUT VEÍCULOS / LUBRIFICANTES",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-manut-veiculos-pecas",
      name: "MATERIAL P/ MANUT VEÍCULOS / PEÇAS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "material-manut-veiculos-pneus",
      name: "MATERIAL P/ MANUT VEÍCULOS / PNEUS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "medicamentos",
      name: "MEDICAMENTOS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "outros-materiais-consumo",
      name: "OUTROS MATERIAIS DE CONSUMO",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "produtos-agricolas",
      name: "PRODUTOS AGRÍCOLAS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "uniformes-tecidos-aviamentos",
      name: "UNIFORMES, TECIDOS E AVIAMENTOS",
      category: "MATERIAL DE CONSUMO",
    },
    {
      id: "vestuario-roupas-calcados-acessorios",
      name: "VESTUÁRIO / ROUPAS, CALÇADOS E ACESSÓRIOS",
      category: "MATERIAL DE CONSUMO",
    },
  
    // Equipamentos e materiais permanentes
    {
      id: "academia-playground",
      name: "ACADEMIA E PLAYGROUND",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "acessorios-automoveis",
      name: "ACESSÓRIOS PARA AUTOMÓVEIS",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "aparelhos-equipamentos-comunicacao",
      name: "APARELHOS E EQUIPAMENTOS DE COMUNICAÇÃO",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "aparelhos-equipamentos-esportes",
      name: "APARELHOS E EQUIPAMENTOS PARA ESPORTES E DIVERSÕES",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "aparelhos-equip-medico",
      name: "APARELHOS, EQUIP., UTENSÍLIOS MÉDICO-ODONTOLÓGICO, LAB. E HOSPITALAR",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "aparelhos-utensilios-domesticos",
      name: "APARELHOS E UTENSÍLIOS DOMÉSTICOS",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "ar-condicionado",
      name: "AR CONDICIONADO",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "equipamento-protecao-seguranca",
      name: "EQUIPAMENTO DE PROTEÇÃO, SEGURANÇA E SOCORRO",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "equipamentos-informatica",
      name: "EQUIPAMENTOS DE INFORMÁTICA E PROCESSAMENTO DE DADOS",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "equipamentos-manobra-patrulhamento",
      name: "EQUIPAMENTOS DE MANOBRA E PATRULHAMENTO",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "equipamentos-utensilios-hidraulicos",
      name: "EQUIPAMENTOS E UTENSÍLIOS HIDRÁULICOS E ELÉTRICOS",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "equipamentos-audio-video-foto",
      name: "EQUIPAMENTOS PARA ÁUDIO, VÍDEO E FOTO",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "ferramentas-maquinas-equipamentos",
      name: "FERRAMENTAS, MÁQUINAS E EQUIPAMENTOS",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "instrumentos-musicais-artisticos",
      name: "INSTRUMENTOS MUSICAIS E ARTÍSTICOS",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "maquinas-equipamentos-agricolas",
      name: "MÁQUINAS E EQUIPAMENTOS AGRÍCOLAS E RODOVIÁRIOS",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "maquinas-equipamentos-industriais",
      name: "MÁQUINAS E EQUIPAMENTOS DE NATUREZA INDUSTRIAL",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "maquinas-equipamentos-graficos",
      name: "MÁQUINAS E EQUIPAMENTOS GRÁFICOS",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "maquinas-instalacoes-escritorio",
      name: "MÁQUINAS, INSTALAÇÕES E UTENSÍLIOS DE ESCRITÓRIO",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "maquinas-utensilios-diversos",
      name: "MÁQUINAS, UTENSÍLIOS E EQUIPAMENTOS DIVERSOS",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "mobiliario-geral",
      name: "MOBILIÁRIO EM GERAL",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "outros-materiais-permanente",
      name: "OUTROS MATERIAIS PERMANENTE",
      category: "EQUIP E MAT PERMANENTE",
    },
    {
      id: "veiculos-diversos",
      name: "VEÍCULOS DIVERSOS",
      category: "EQUIP E MAT PERMANENTE",
    },
  
    // Serviços de Terceiros
    {
      id: "servicos-graficos",
      name: "SERVIÇOS GRÁFICOS",
      category: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "servicos-manutencao-veiculos",
      name: "SERVIÇOS PARA MANUTENÇÃO DE VEÍCULOS",
      category: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "passagens-despesas-locomocao",
      name: "PASSAGENS E DESPESAS COM LOCOMOÇÃO",
      category: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "obras-instalacoes",
      name: "OBRAS E INSTALAÇÕES",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE ENGENHARIA",
    },
    {
      id: "confeccao-uniformes-bandeiras",
      name: "CONFECÇÃO DE UNIFORMES, BANDEIRAS E FLÂMULAS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "dedetizacao-desratizacao",
      name: "DEDETIZAÇÃO, DESINSETIZAÇÃO, DESRATIZAÇÃO E LIMPEZA DE CAIXA D ÁGUA",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "festividades-homenagens",
      name: "FESTIVIDADES E HOMENAGENS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "fornecimento-alimentacao",
      name: "FORNECIMENTO DE ALIMENTAÇÃO",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "hospedagens",
      name: "HOSPEDAGENS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "limpeza-conservacao",
      name: "LIMPEZA E CONSERVAÇÃO",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "limpeza-manutencao-ar-condicionado",
      name: "LIMPEZA E MANUTENÇÃO DE AR CONDICIONADO",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "locacao-imoveis",
      name: "LOCAÇÃO DE IMÓVEIS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "locacao-maquinas-equipamentos",
      name: "LOCAÇÃO DE MÁQUINAS E EQUIPAMENTOS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "locacao-softwares",
      name: "LOCAÇÃO DE SOFTWARES",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "locacao-veiculos",
      name: "LOCAÇÃO DE VEÍCULOS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "manutencao-conservacao-imoveis",
      name: "MANUTENÇÃO E CONSERVAÇÃO DE BENS IMÓVEIS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "manutencao-conservacao-maquinas",
      name: "MANUTENÇÃO E CONSERVAÇÃO DE MÁQUINAS E EQUIPAMENTOS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "manutencao-conservacao-veiculos",
      name: "MANUTENÇÃO E CONSERVAÇÃO DE VEÍCULOS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "outros-servicos-terceiros",
      name: "OUTROS SERVIÇOS DE TERCEIROS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "seguros-geral",
      name: "SEGUROS EM GERAL",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "servico-medico-hospitalar",
      name: "SERVIÇO MÉDICO-HOSPITALAR, ODONTOLÓGICO E LABORATORIAL",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "servicos-audio-video-foto",
      name: "SERVIÇOS DE ÁUDIO, VÍDEO E FOTO",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "servicos-comunicacao-geral",
      name: "SERVIÇOS DE COMUNICAÇÃO EM GERAL",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "servicos-consultoria",
      name: "SERVIÇOS DE CONSULTORIA",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "servicos-telecomunicacoes",
      name: "SERVIÇOS DE TELECOMUNICAÇÕES",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "servicos-funerarios",
      name: "SERVIÇOS FUNERÁRIOS",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
    {
      id: "transporte-escolar",
      name: "TRANSPORTE ESCOLAR",
      category: "SERVIÇOS DE TERCEIROS",
      subcategory: "SERVIÇOS DE TERCEIROS",
    },
  
    // Outros (para manter compatibilidade com o formulário existente)
    {
      id: "material-consumo-higiene",
      name: "MATERIAL DE CONSUMO / MATERIAL DE HIGIENE",
      category: "OUTROS",
    }
  ]
  
  // Função para obter todos os elementos de despesa
  export const getAllExpenseElements = (): ExpenseElement[] => {
    return expenseElements
  }
  
  // Função para obter elementos de despesa por categoria
  export const getExpenseElementsByCategory = (category: ExpenseCategory): ExpenseElement[] => {
    return expenseElements.filter((element) => element.category === category)
  }
  
  // Função para buscar elementos de despesa por texto
  export const searchExpenseElements = (searchText: string): ExpenseElement[] => {
    if (!searchText || searchText.trim() === "") {
      return expenseElements
    }
  
    const normalizedSearch = searchText.toLowerCase().trim()
  
    return expenseElements.filter(
      (element) =>
        element.name.toLowerCase().includes(normalizedSearch) ||
        (element.subcategory && element.subcategory.toLowerCase().includes(normalizedSearch)),
    )
  }
  
  // Função para obter um elemento de despesa por ID
  export const getExpenseElementById = (id: string): ExpenseElement | undefined => {
    return expenseElements.find((element) => element.id === id)
  }
  
  // Função para obter um elemento de despesa por nome
  export const getExpenseElementByName = (name: string): ExpenseElement | undefined => {
    return expenseElements.find((element) => element.name === name)
  }
  
  