CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL CHECK (char_length(nome) BETWEEN 1 AND 120),
  empresa text NOT NULL DEFAULT '' CHECK (char_length(empresa) <= 120),
  cargo text NOT NULL DEFAULT '' CHECK (char_length(cargo) <= 120),
  email text NOT NULL DEFAULT '' CHECK (char_length(email) <= 255),
  telefone text NOT NULL DEFAULT '' CHECK (char_length(telefone) <= 30),
  vendedor text NOT NULL DEFAULT '' CHECK (char_length(vendedor) <= 120),
  valor_estimado numeric(14,2) NOT NULL DEFAULT 0 CHECK (valor_estimado >= 0),
  status text NOT NULL DEFAULT 'avaliacao' CHECK (status IN ('avaliacao','proposta','negociacao','fechado')),
  temperatura text NOT NULL DEFAULT 'frio' CHECK (temperatura IN ('frio','morno','quente')),
  observacoes text NOT NULL DEFAULT '' CHECK (char_length(observacoes) <= 5000),
  criado_em timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acesso público aos leads (app sem login)" ON public.leads FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

INSERT INTO public.leads (nome, empresa, cargo, email, telefone, vendedor, valor_estimado, status, temperatura, observacoes) VALUES
('Rafael Souza','Nexus Logística','Diretor de operações','rafael@nexuslog.com.br','(11) 98877-1020','Marlon Rodrigues',32000,'avaliacao','frio','Chegou pelo site.'),
('Camila Ribeiro','Bela Moda','Gerente de marketing','camila@belamoda.com.br','(21) 99712-3344','Juliana Alves',18500,'avaliacao','morno',''),
('Bruno Martins','AgroVale','Coordenador de compras','bruno@agrovale.com.br','(34) 99123-4567','Mariana Costa',54000,'proposta','quente','Pediu proposta com desconto anual.'),
('Fernanda Lima','Clínica Vida','Sócia','fernanda@clinicavida.com.br','(31) 98456-7788','Marlon Rodrigues',12800,'proposta','frio',''),
('Lucas Pereira','Construtora Pilar','Engenheiro chefe','lucas@pilar.com.br','(41) 99345-6612','Juliana Alves',76000,'negociacao','quente','Negociando prazo de pagamento.'),
('Patrícia Gomes','EducaMais','Diretora','patricia@educamais.com.br','(51) 98234-9900','Mariana Costa',23400,'negociacao','morno',''),
('Diego Almeida','TechPoint','CEO','diego@techpoint.com.br','(11) 97654-3210','Marlon Rodrigues',41000,'fechado','quente','Contrato assinado.'),
('Aline Santos','Sabor & Cia','Proprietária','aline@saborecia.com.br','(85) 99876-5544','Juliana Alves',9600,'fechado','morno','');