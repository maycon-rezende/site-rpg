# Resumo do Projeto — Arquivo dos Destinos

Atualizado em 14 de agosto de 2026.

## Visão geral

Site temático de RPG em HTML, CSS e JavaScript que reúne tomos narrativos de personagens, companheiros, poderes, relações e diferentes mundos. A página inicial é `index.html`; os tomos possuem páginas próprias e compartilham estilos responsivos.

## Páginas existentes

- `index.html`: Arquivo dos Destinos e navegação principal.
- `intro.html`: portal e abertura cinematográfica dos Guardiões do Destino.
- `jack-connor.html`: Dr. Jack Connor.
- `noada.html`: Noada e Eira Elenwë.
- `alucard.html`: Kurosaki Alucard.
- `nero.html`: Uchiha Hyuuga Nero, Hinara e a Equipe 10.
- `knull.html`: Knull, Nimsay, Blue e a origem de Yuri.

## Nero, Hinara e a Equipe 10

Nero é herdeiro das linhagens Uchiha e Hyuuga. Foi salvo por seu sensei Senju Hashimo através da transferência de células Senju, reunindo três heranças. Usa duas espadas e carrega uma tatuagem de dragão.

A lendária Equipe 10 é formada por Nero, Hyuuga Hinara e Senju Renjiro, sob orientação de Hashimo. Nero e Hinara tornam-se marido e mulher e protegem um mundo oculto dos demais shinobis.

### Evolução ocular de Nero

1. Sharingan.
2. Mangekyō Sharingan com padrão atômico.
3. Mangekyō Sharingan Eterno.
4. Rinne Sharingan completo.
5. Shinkungan, o dōjutsu final e mais poderoso.

O Shinkungan se manifesta somente nos dois olhos naturais. Nero não possui terceiro olho nem marca na testa.

### Evolução ocular de Hinara

1. Byakugan.
2. Evoluções intermediárias com anéis e espirais.
3. Tenseigan.
4. Shikungan, evolução final do Tenseigan.

O Shikungan possui íris azul-clara luminosa, pupila vertical e runas vermelhas concêntricas. Manifesta-se somente nos dois olhos naturais. Hinara não possui terceiro olho, joia ou marca na testa.

### Artes finais adicionadas

- `img-nero/nero-shinkungan-final.png`
- `img-nero/hinara-shikungan-final.png`
- `img-nero/nero-hinara-guardioes.png`

## Knull, Nimsay, Yuri e Blue

Knull nasceu como Yuri, descendente das linhagens Uchiha e Hyuuga. Em sua jornada foi conhecido como Mestre dos Elementos e Deus dos Elementos. Ao assumir o nome Knull, integrou a linhagem dos Null ao lado de Anull e Onull.

Blue foi criado por Yuri desde o ovo. O pacto entre os dois atravessou matéria e espírito; a fusão com o Rei Dragão levou Knull à condição de Deus Dragão. Sua Armadura de Dragão evolui junto dele.

Nimsay é a companheira humana de Knull: uma rainha e guerreira de cabelos branco-prateados, olhos azuis e joias turquesa. Ela possui orelhas humanas normais e arredondadas — nunca élficas. Possui uma forma régia branca e dourada, ligada a água e fogo, e uma forma sombria em armadura negra e dourada, com cajado de cristal azul e energia azul-violeta. Ela é contraponto e igual de Knull, não uma extensão dele.

### Artes finais adicionadas

- `img-knull/nimsay-rainha-sombria.png` permanece como referência histórica, mas contém orelhas élficas incorretas e não deve ser usada como representação canônica.
- `img-knull/nimsay-humana-armadura.png` é a representação canônica individual de Nimsay em sua armadura negra.
- `img-knull/knull-nimsay-guardioes.png`
- `img-knull/nimsay.png` e `img-knull/knull-e-nimsay.png` são referências oficiais fornecidas pelo autor.
- `img-knull/knull-blue.png` continua como referência principal de Knull e Blue.

Outras referências de Knull, Yuri e paisagens estão armazenadas em `img-knull/`.

## Decisões visuais e técnicas

- A pasta original `img` foi renomeada para `img-connor`; todas as referências do site foram atualizadas. Novas imagens do Dr. Connor/Mago Supremo foram incorporadas à pasta e ele ganhou uma aparição própria na abertura.
- `intro.html` ganhou um portal interativo de entrada com a chamada **“Romper o Véu do Destino”**.
- A abertura apresenta 12 quadros responsivos de protagonistas, companheiras e casais, com movimento contínuo e cortes distribuídos pela duração real da música.
- O encontro de todo o elenco foi preservado para o ápice final e recebeu o título provisório **“Guardiões do Destino”**.
- A música `music/themeinicial.mp3` foi integrada à abertura, com controle acessível para iniciar ou pausar; a animação não depende da confirmação de reprodução do navegador.
- A duração das apresentações é sincronizada automaticamente à duração real da música, mantendo variedade visual mesmo no trecho inicial mais lento.
- O efeito visual de ruído/estática foi removido completamente da abertura.
- Knull e Nimsay aparecem juntos por meio de `img-knull/knullsay.png`: Nimsay está humana, sem orelhas élficas e com armadura negra combinando com a de Knull.
- O quadro individual de Nimsay usa `img-knull/nimsay-humana-armadura.png`, com armadura negra, cajado e orelhas humanas arredondadas.
- Os quadros de Eira e do casal Noada/Eira usam `img-noada/eira-arqueira.png` e `img-noada/noada-e-eira-montanhas.png`.
- Os quadros da abertura passaram a usar a arte principal com `object-fit: contain` sobre uma camada desfocada da mesma imagem, evitando ampliações e cortes excessivos em qualquer proporção de tela.
- A abertura possui composição adaptada para celular e respeita `prefers-reduced-motion`, exibindo diretamente o título quando o usuário reduz animações.
- Corrigido o nome do poder final de Nero para **Shinkungan**.
- Removida a interpretação de terceiro olho de Nero e Hinara.
- A página de Nero ganhou progressão dos dōjutsus, história da Equipe 10 e galeria do casal.
- A página de Knull ganhou a história de Nimsay, a origem de Yuri e galeria com Blue.
- Os cartões da página inicial foram atualizados com as novas artes e descrições.
- `new-tomes.css` recebeu uma galeria responsiva reutilizável.
- Todas as imagens geradas para uso no projeto foram copiadas para as pastas do site; nenhuma referência depende de arquivo temporário.

## Continuidade

Antes de novas alterações, ler este arquivo e conferir `git status`. Preservar sempre os nomes, relações, evoluções oculares e regras visuais documentadas acima.
