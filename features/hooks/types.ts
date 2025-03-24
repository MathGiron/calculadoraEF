export interface Response {
  id: string;
  name: string;
  powerW?: number,
  hoursPerDay?: number
}

// Interface para representar os metafields (campos personalizados)
interface Metafield {
  key: string;   // Chave do campo (ex: "saidas_pot_ncia_m_xima_do_dispositivo_com_x_boost_")
  value: string; // Valor associado à chave (ex: "4.800W")
}

// Interface principal para representar o produto
export interface Produto {
  title: string;        // Título ou nome do produto
  metafields: Metafield[]; // Lista de metafields personalizados
}

