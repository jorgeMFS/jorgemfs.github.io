---
layout: post
lang: pt
ref: ai-most-important-number
title: O Número Mais Importante da IA Nunca Foi Medido
date: 2026-08-04
categories: [Ensaios]
description: Quanto maior fica realmente uma economia quando as máquinas conseguem fazer o trabalho? A resposta depende de um único número que ninguém mediu, apesar de as ferramentas para o medir existirem desde os anos 70.
hero_image: /assets/img/abstract_painting_post3.webp
hero_alt: Pintura a óleo abstrata de uma figura solitária a uma secretária na penumbra, uma multidão de silhuetas ténues ao fundo, e uma curva dourada de luz a subir sobre uma cidade em rede
---

*Pensava que as máquinas iam ficar com a maior parte do trabalho. Propus-me descobrir quanto, e acabei a desmontar o meu próprio argumento. As ferramentas que resolveriam a questão estão paradas desde os anos 70. Continuo a achar que isto vem aí. A resposta é apenas mais estranha do que um sim ou um não.*

Mais cedo ou mais tarde, as máquinas farão a maior parte do trabalho pelo qual as pessoas são hoje pagas para pensar.

Há dez anos, isto era uma coisa que se dizia no fim de uma palestra, quando os slides tinham acabado e já ninguém tomava notas. Agora aparece em planos de investimento, à medida que laboratórios lançam sistemas que escrevem código de produção e leem exames, os ministérios das finanças o incorporam nas previsões de crescimento, e os investidores lhe atribuem o preço da maior realocação de trabalho desde que o setor foi mecanizado. Seja lá o que isto for, deixou de ser uma coisa sobre a qual se especula e passou a ser uma coisa para a qual se faz orçamento.

Quase toda a discussão é sobre calendário e sobre vencedores. Quantos empregos desaparecem e a que ritmo, que empresas capturam o valor, se os modelos estão a raciocinar ou a representar, se alguma coisa disto é segura. Passei meses na última dessas questões, a argumentar que os ganhos acabam em pouquíssimas mãos e que toda a gente empobrece devagar o suficiente para que ninguém consiga nomear o dia em que começou.

Por baixo de tudo isto há uma pergunta que tem de ser respondida primeiro, e que quase ninguém faz em voz alta.

Quanto maior fica realmente uma economia quando as máquinas conseguem fazer o trabalho?

Não quando, nem quem ganha, mas quanto. O trabalho aqui é trabalho de conhecimento, a parte pensante da economia, que é onde estes sistemas chegam primeiro. Fui à procura desse número à espera de encontrar um número grande e uma discussão sobre datas. A resposta é uma curva sem ninguém em cima dela.

## Comecemos pelos médicos

Na profissão que a intuição assinala como a mais humana de todas, os médicos passam mais tempo do dia de trabalho em papelada do que com doentes.

Isto não é uma impressão. Num [estudo de observação direta](https://www.acpjournals.org/doi/10.7326/M16-0961) publicado nos *Annals of Internal Medicine*, os investigadores acompanharam 57 médicos de quatro especialidades e quatro estados norte-americanos ao longo de 430 horas, cronómetro na mão, registando ao minuto o que cada um estava a fazer. O tempo clínico direto, cara a cara com os doentes, ficou-se pelos [27,0% do dia](https://www.acpjournals.org/doi/10.7326/M16-0961). Os registos clínicos eletrónicos e o trabalho de secretária chegaram aos 49,2%, e mesmo dentro do gabinete de consulta, com o doente fisicamente presente, [apenas 52,9% do tempo foi passado cara a cara](https://www.acpjournals.org/doi/10.7326/M16-0961).

Ninguém mediu isto para dizer o que quer que fosse sobre inteligência artificial. O estudo foi [financiado pela Associação Médica Americana](https://www.acpjournals.org/doi/10.7326/M16-0961) e publicado em 2016, e o seu objetivo era o esgotamento profissional dos médicos.

Li-o da mesma maneira que suspeito que o leitor acabou de o ler. Três quartos da medicina não são medicina, mas administração, documentação e coordenação, e administração, documentação e coordenação são exatamente aquilo em que estes modelos são bons. Se o padrão se mantiver nas várias profissões, o teto é enorme e a discussão termina antes de começar.

Essa leitura está errada. Perceber porquê levou-me a dois resultados que não andava à procura, e acabou comigo a desmontar o meu próprio argumento.

## Tudo depende de um único número

Suponhamos que uma fração do trabalho não pode ser acelerada de todo, e chamemos-lhe *f*. Aceleremos tudo o resto sem limite e o ganho total não dispara. Converge para um a dividir por *f*.

Isto é a lei de Amdahl, saída de um artigo de quatro páginas sobre processadores paralelos em 1967, e é a coisa menos controversa que aqui se diz.[^1] Se um quarto do trabalho fica onde está, o teto é quatro vezes. Se ficar um quinto, cinco. Se ficar um décimo, dez.

Repare-se no que isto faz ao debate, porque a resposta oscila numa ordem de grandeza consoante o valor de um único número, o número não tem nada a ver com a tecnologia, e não é preciso saber seja o que for sobre os modelos para o calcular. É preciso saber que parte do trabalho tem de continuar humana.

{% include figure.html path="/assets/img/figure_reciprocal.webp" alt="A lei de Amdahl representada graficamente: ganho máximo possível no trabalho de conhecimento em função da fração do trabalho que tem de continuar humana, com uma faixa sombreada a cobrir o intervalo das estimativas publicadas" caption="O maior ganho possível no trabalho de conhecimento, representado em função da fração do trabalho que tem de continuar humana. A curva é a lei de Amdahl. A faixa sombreada cobre o intervalo onde cai toda e qualquer estimativa publicada dessa fração. Essas estimativas vêm de estudos sobre a forma como o tempo é atualmente gasto, e nenhuma delas mede o mínimo que o trabalho exige." %}

Por isso fui descobrir, e é aí que os problemas começam. Levei quase um ano a ver.

## Cinco experiências que parecem uma contradição

A literatura que devia resolver quanto é que estas ferramentas fazem de facto parece, numa primeira leitura, uma confusão.

[Noy e Zhang](https://www.science.org/doi/10.1126/science.adh2586) distribuíram aleatoriamente tarefas de escrita profissional por 453 profissionais com formação superior e encontraram uma redução de 40% no tempo e um aumento de 18% na qualidade, com os ganhos concentrados nos piores escritores. [Peng et al](https://arxiv.org/abs/2302.06590) aleatorizaram uma tarefa de programação de raiz e concluíram que o grupo assistido terminou 55,8% mais depressa. [Cui et al](https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf) juntaram três experiências de campo com 4867 programadores em atividade na Microsoft, na Accenture e numa empresa de eletrónica da Fortune 100, e encontraram 26% mais produção, com valores maiores para quem tinha menos antiguidade. [Brynjolfsson, Li e Raymond](https://www.nber.org/papers/w31161) acompanharam 5179 agentes de apoio ao cliente ao longo de uma implementação real faseada e encontraram 14% em média, 34% para os novatos, e nenhum efeito mensurável nos experientes e altamente qualificados.

Depois a [METR](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) conduziu o ensaio mais cuidadoso do conjunto, com dezasseis programadores experientes de código aberto a trabalhar em repositórios onde tinham, em média, cinco anos de histórico, ao longo de 246 problemas reais com 143 horas de gravação de ecrã etiquetadas à mão, e concluiu que estavam 19% *mais lentos* com as ferramentas do que sem elas.

Antes do ensaio, esses programadores tinham [previsto uma aceleração de 24%](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/), os economistas a quem se pediu um palpite disseram 39%, e os investigadores de aprendizagem automática disseram 38%. Depois, já com o trabalho feito, os próprios programadores continuavam a estimar que tinham ganho 20%.

É tentador ler o resultado da METR como a única medição honesta e todos os outros como ruído. Essa leitura não sobrevive aos números.

Os cinco estudos são um só resultado medido em cinco pontos ao longo de um único eixo. Todos eles encontram a mesma coisa assim que os ordenamos pela distância a que o trabalhador já estava daquilo que o modelo consegue fazer. Tarefas de escrita entregues a pessoas que não são escritores, o maior efeito. Tarefas sintéticas de programação sem contexto prévio, muito grande. Programadores reais em trabalho que não conhecem, moderado. Agentes de apoio com guiões e novatos, grande para os novatos e nulo para os peritos. Programadores experientes dentro de bases de código que eles próprios construíram, negativo.

O ganho não é uma propriedade da tecnologia. É uma propriedade da distância entre o trabalhador e o modelo.

Brynjolfsson enuncia o mecanismo sem rodeios. O sistema funciona captando e disseminando os padrões de comportamento dos agentes mais produtivos, incluindo conhecimento tácito que até aí tinha escapado à automação, e ajudando os trabalhadores mais recentes a descer a curva de experiência. O sistema está a comprimir uma distribuição de desempenho, e uma distribuição só pode ser comprimida uma vez.

## Quanto espaço existe, na realidade

Se o ganho vem de nivelar toda a gente por cima, em direção ao melhor desempenho, então o ganho total disponível está limitado pela distância que já separa o melhor da média. É uma grandeza mensurável, e foi medida muito antes de tudo isto.

[Hunter, Schmidt e Judiesch](https://gwern.net/doc/iq/ses/1990-hunter.pdf) reuniram 68 estudos de produção real de trabalho e 17 estudos de amostras de trabalho, corrigiram-nos para o erro de medição e para a restrição de amplitude, e calcularam o desvio-padrão da produção individual em percentagem da produção média. Ele [aumenta com a complexidade da função](https://gwern.net/doc/iq/ses/1990-hunter.pdf), de 19% em trabalho de baixa complexidade para 32% em complexidade média e 48% em trabalho profissional e de gestão de alta complexidade.

A partir desses valores, calculam quanto produz o 1% do topo em relação à média, tomando como base todos os que poderiam fazer o trabalho e não apenas os que já o fazem. São [1,52 vezes no trabalho de baixa complexidade, 1,85 no de média, e 2,27 no de alta complexidade](https://gwern.net/doc/iq/ses/1990-hunter.pdf).[^2]

O mesmo artigo dá depois três razões distintas para que 2,27 seja um valor demasiado baixo.

Os autores [dizem-no abertamente](https://gwern.net/doc/iq/ses/1990-hunter.pdf). Estas distribuições têm assimetria positiva em vez de serem normais, e numa distribuição com assimetria positiva o 1% do topo situa-se mais acima da média do que o modelo normal o coloca.

Também deitaram fora o seu caso mais extremo. Um estudo de trabalho de alta complexidade nunca entrou nas médias, porque extrair dele um desvio-padrão teria exigido assumir uma distribuição normal e os autores recusaram-se a assumi-la naquele nível de complexidade. Era um estudo sobre programadores informáticos, no qual [os mais produtivos produziam dezasseis vezes mais do que os menos produtivos](https://gwern.net/doc/iq/ses/1990-hunter.pdf).[^3]

E o modelo deles coloca o piso num sítio impossível. Para trabalho de alta complexidade, prevê produção negativa na base da distribuição. Os autores concluem que [o verdadeiro fundo está em zero ou perto disso](https://gwern.net/doc/iq/ses/1990-hunter.pdf), e as palavras deles para explicar porquê são que, nestas ocupações, quem tem mau desempenho não consegue sequer aprender a função.

Juntem-se estas três coisas e a compressão muda de natureza. Não é toda a gente a ficar um pouco melhor, mas uma cauda de pessoas que não conseguiam de todo fazer o trabalho a tornarem-se capazes de o fazer, que é precisamente o aspeto que um ganho de 34% para novatos e um ganho nulo para peritos tem visto por dentro.

Este foi o primeiro resultado que eu não andava à procura. O maior ganho disponível a partir desta tecnologia não pede às máquinas nada para além do que elas já fazem. Exige apenas que levem aquilo que a melhor pessoa da sala já sabe a toda a gente, e para num número que foi medido em 1990.

## Onde o ganho individual morre

Há uma segunda literatura que mede a mesma coisa um nível acima.

Os economistas estimam fronteiras de eficiência desde os anos 70, e as duas ferramentas de referência surgiram com um ano de intervalo, a [análise envoltória de dados](https://www.sciencedirect.com/science/article/pii/S0377221724009913) de Charnes, Cooper e Rhodes em 1978 e a [análise de fronteira estocástica](https://link.springer.com/article/10.1007/s11123-010-0201-3) de Aigner, Lovell e Schmidt em 1977. Ambas partem dos inputs e outputs observados num conjunto de organizações e calculam quanto input a melhor delas precisa para produzir um dado output, o que faz do referencial uma prática real e não um limite teórico. A distância entre uma unidade e essa fronteira chama-se ineficiência técnica, e é exatamente a folga compressível.

Onde foi aplicada, dá respostas reais, e nunca duas vezes a mesma resposta. Um estudo de fronteira estocástica sobre laboratórios de diagnóstico hospitalar no Irão [colocou a eficiência técnica média em 93,1%](https://link.springer.com/article/10.1186/s12962-022-00406-8), deixando cerca de 7% do input recuperável. Os [mesmos laboratórios analisados por análise envoltória de dados](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7031620/) deram 98,3%, deixando 1,7%. Uma comparação de métodos em hospitais ingleses concluiu que [não existem diferenças de eficiência verdadeiramente grandes entre eles](https://link.springer.com/article/10.1023/A:1011453526849). E no outro extremo, os hospitais públicos na Palestina [ficaram-se por uma média de 55%](https://resource-allocation.biomedcentral.com/articles/10.1186/s12962-016-0052-5), o que corresponde a 45% do output recuperável com os mesmos recursos.

Os locais diferem, e os instrumentos também. Um laboratório de diagnóstico num sistema que funciona e um hospital público num sistema sob pressão não bebem do mesmo mundo, e cada método traça a fronteira à sua maneira, que é como os mesmos laboratórios podem sair com cinco pontos de diferença sob os dois instrumentos.

A folga compressível dentro das organizações é real, mensurável, e enormemente dependente do sítio onde se olha. E nunca chega sequer perto do número individual.

Os 2,27 de Hunter significam 127% mais produção se se levar a média até ao topo. Ponha-se isso contra a fronteira, produção por pessoa contra input por organização, e o cenário com mais folga que alguém alguma vez mediu oferece 45%. O cenário típico oferece menos de 10%. A diferença mantém-se em todos os pontos do intervalo.

A reconciliação não está em que uma delas esteja errada, mas em que uma organização já é, ela própria, uma média. Tem o cirurgião excelente e o medíocre, o bom território e o mau, a equipa forte e a fraca, e junta-os antes de o que quer que seja ser medido. A variância individual é real e enorme, e a maior parte dela desaparece na agregação.

Levei algum tempo a aceitar isto. As cinco experiências medem indivíduos, e a economia é feita de organizações. Entre as duas coisas há um passo que ninguém nesta discussão orçamentou, e a única literatura que mediu esse passo diz que o espaço lá em cima é pequeno. Foi este o segundo resultado que eu não andava à procura.

## O que o cronómetro mediu de facto

A esta altura eu tinha aquilo que parecia um argumento completo. A compressão está limitada pela variância humana, tudo o que vai para além dela exige que a máquina supere a melhor pessoa viva, e o conjunto está limitado pela fração do trabalho que continuar humana, que é onde os médicos voltavam a entrar.

Por isso construí a fração. Contacto direto com o doente para os médicos, tempo letivo para os professores, em que os professores americanos passam [27 horas a lecionar numa semana de trabalho de 45 horas](https://www.americanprogress.org/article/reimagining-the-school-day/) e o instituto federal de estatística [coloca o valor em 28 horas dentro de 46 trabalhadas](https://nces.ed.gov/pubs2019/2019132.pdf), e tempo interativo para os executivos, retirado do [maior estudo sobre o tempo dos executivos que existe](https://www.hbs.edu/ris/Publication%20Files/CEOBehavior_jpe_final_71005256-9f8f-43fc-a5df-780ea0b6adc0.pdf), que acompanhou 1114 diretores executivos de empresas industriais em seis países durante uma semana cada e registou 42.233 atividades distintas. Ponderado contra a [massa salarial de 6,90 biliões de dólares do trabalho de conhecimento](https://www.bls.gov/news.release/ocwage.t01.htm), deu cerca de um quarto, e um quarto coloca o teto perto de quatro vezes.

Fiquei satisfeito com aquele número durante meses, e ele está errado por uma razão embaraçosamente simples.

Um cronómetro mede o que alguém fez, não o que alguém tinha de fazer.

Os médicos daquele estudo passaram 27% do dia com doentes. Nada no estudo pergunta se aqueles minutos poderiam ser encurtados, agrupados, partilhados, deslocados para outro momento da consulta, ou tratados de outra maneira. Os autores estavam a contar esgotamento e não necessidade, e um professor leciona a trinta crianças ou a uma, e o cronómetro marca o mesmo nos dois casos. Um diretor executivo faz uma reunião de uma hora que poderia ter tido dez minutos, e o cronómetro regista uma hora.

Os médicos não são um caso especial. Um estudo de tempos e movimentos com enfermeiros de urgência [concluiu que passam mais tempo do turno no registo clínico eletrónico do que com os doentes](https://pubmed.ncbi.nlm.nih.gov/33888334/), 27% contra 25%. A mesma profissão, a mesma inversão, outra década.

E a enfermagem mostra o problema mais profundo dentro de um único estudo. Amostragem de trabalho em enfermarias cirúrgicas [coloca os cuidados diretos ao doente entre 40% e 56%](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5916856/) do turno, enquanto o mesmo estudo encontra os enfermeiros efetivamente à cabeceira 31% do tempo. Cuidado direto e estar no quarto não são a mesma categoria, e a escolha entre uma e outra desloca a resposta entre nove e vinte e cinco pontos. Nenhum destes estudos perguntava qual é o mínimo. Perguntavam para onde vai o tempo.

O mesmo erro está a ser cometido no outro extremo da discussão, em público. Em abril de 2026, Sundar Pichai [colocou em 75% a proporção de código novo escrito por máquina na Google](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/cloud-next-2026-sundar-pichai/), acima de um quarto dezoito meses antes, e de cada vez que a Google publicou esse número emparelhou-o com as palavras revisto, aceite ou aprovado por engenheiros. Escrever código representa [entre 9% e 61% do dia de um programador, consoante o estudo](https://discovery-pp.ucl.ac.uk/10090507/1/Barr_Today%20was%20a%20Good%20Day.%20The%20Daily%20Life%20of%20Software%20Developers_AAM2.pdf), com um grande inquérito a [colocar o código novo e melhorado em 32%](https://www.sonarsource.com/blog/how-much-time-do-developers-spend-actually-writing-code/). Linhas não são trabalho, e a razão entre as duas coisas também nunca foi estabelecida.

Cada um daqueles números é a descrição de um hábito. Eu tinha andado a tratá-los como descrições de uma exigência.

E o erro corre nos dois sentidos, que é o que o torna fatal em vez de meramente conservador. Se metade da papelada do médico for teatro administrativo que um sistema são eliminaria sem máquina nenhuma, então a parcela compressível é menor do que parece. Se metade do tempo de contacto for costume e não necessidade clínica, a parcela irredutível também é menor. Nenhuma das duas foi medida, e eu tinha construído um teto a partir de duas grandezas que ninguém tinha estabelecido, e depois calculado um inverso com três algarismos significativos.

## A parte que eu queria que fosse física e não é

Uma versão do argumento sobrevive a isto, e passei semanas a tentar fazê-la funcionar.

Certo trabalho não está à espera de máquinas melhores porque o obstáculo nunca foi a capacidade. Um professor primário não pode vigiar uma sala a partir de outro sítio. Uma negociação precisa de uma parte que tenha algo a perder. A condição bloqueadora não é a tarefa exigir legalmente um humano, o que é uma coisa mais fraca do que parece. Um radiologista tem de assinar o relatório, mas a assinatura demora segundos. Se a máquina fizer a leitura, o radiologista fica três vezes mais rápido e continua a assinar tudo, e dois terços daquele tempo foram automatizados com a exigência legal exatamente onde estava. O licenciamento bloqueia a substituição. Não bloqueia a compressão.

A resposta óbvia são os robôs, e para boa parte deste trabalho a resposta está certa. Concedamo-lo por inteiro à cirurgia, onde uma máquina com melhores resultados seria escolhida em vez de uma pessoa e a preferência pela mão humana não sobrevive às estatísticas.

O que resta não é física mas arranjo, uma vez que continuamos a exigir que uma pessoa seja a parte responsável e não o instrumento em certos lugares, com uma criança de sete anos numa sala de aula, uma assinatura num contrato, e uma decisão pela qual alguém tem de responder.

Não acredito que esse arranjo seja estável, porque as pessoas já falam com estes sistemas todos os dias, criam ligações afetivas com eles, e nalguns casos descrevem relações com eles. Junte-se isso a robótica funcional e a exigência de que uma pessoa esteja presente começa a parecer um hábito com prazo de validade e não uma lei da natureza. O que significa que o teto que eu tinha construído assenta em algo que espero ver dissolver-se. Essa expectativa é uma hipótese, não um resultado. Nada neste ensaio a mede.

## As ferramentas estão ali desde os anos 70

Portanto a grandeza de que tudo depende nunca foi medida, e eu também não a consigo fornecer.

É mensurável. O equipamento está no edifício há cinquenta anos.

A análise de fronteira existe precisamente para separar aquilo que uma organização usa daquilo que a melhor prática já consegue. Foi apontada a hospitais, a agências bancárias, a bibliotecas públicas e a laboratórios de diagnóstico. Não nos dará o mínimo teórico, porque só consegue ver as unidades da amostra. Dar-nos-á o input mais baixo que alguém conseguiu de facto atingir, o que é bastante mais do que uma média e é a coisa mais próxima de um piso que existe. Nunca ninguém lhe perguntou de quão pouco tempo humano um trabalho precisa.

Como seria esse estudo não tem mistério. Toma-se uma ocupação e estabelece-se o resultado em vez da atividade, de modo a que um médico seja medido por situações clínicas resolvidas e não por minutos na sala. Estima-se a fronteira em consultórios suficientes para ver os melhores, e pergunta-se depois quanto tempo de contacto humano a prática que está na fronteira usa realmente por caso resolvido, e se esse número se moveu à medida que as ferramentas foram chegando.

Uma outra medição ajudaria quase tanto: ensaios aleatorizados de produtividade repetidos anualmente com um protocolo constante, para que a curva do ganho possa ser observada a achatar ou a não achatar. A história da compressão faz aí uma previsão dura, a de que os ganhos medidos deverão cair à medida que a adoção satura e a distribuição fica sem cauda, e ninguém a está a testar.

Nada disto é caro, dado que um estudo com cronómetro custa uma fração de um único treino de modelo.

## O que fica

Continuo a achar que as máquinas farão a maior parte do trabalho. Já começaram, e o registo é mais pequeno do que a conversa sugere.

Os registos de pagamentos empresariais mostram [a primeira evidência micro de empresas a substituir trabalho contratado por IA](https://ramp.com/data/ai-jobs-impact/paper), a cerca de [três cêntimos de despesa adicional em IA por cada dólar de trabalho online que desapareceu](https://thehill.com/opinion/technology/5796932-generative-ai-impact-on-workforce/). Economistas da Reserva Federal de St. Louis perguntaram a uma amostra representativa a nível nacional quantas horas extra teriam sido necessárias sem as ferramentas e [colocaram a poupança em 5,4% das horas entre os utilizadores e 1,4% no conjunto da força de trabalho](https://thehill.com/opinion/technology/5763078-ais-productivity-is-finally-hitting-the-real-economy/). A Dinamarca, com dados administrativos sobre onze das ocupações mais expostas, [exclui efeitos superiores a 2%](https://www.nber.org/papers/w33777). Todos eles aterram nuns poucos por cento.

Aquilo em que deixei de acreditar é que alguém consiga dizer quanto maior fica a economia, incluindo as pessoas que publicam números, e incluindo eu durante quase um ano. A aritmética é sólida e os dados de entrada não estão estabelecidos. Todos os números confiantes neste debate, num sentido ou no outro, são um inverso calculado a partir de um hábito.

O maior efeito atualmente disponível a partir desta tecnologia corre no sentido oposto ao do medo. Não é elevar uma máquina acima de nós. É elevar pessoas até trabalho que lhes estava vedado, e o estudo que limita tudo isto é explícito sobre quem está no fundo do trabalho complexo, que são as pessoas que não conseguiam sequer aprender a função. Esse efeito está medido, não precisa de mais progresso nenhum, e quase ninguém o está a contar.

Fica desconfortavelmente ao lado do único sinal que alguém encontrou no mercado de trabalho, que é uma [queda relativa de 16% no emprego entre os 22 e os 25 anos](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/) nas ocupações mais expostas. A compressão aumenta a produção de quem já está dentro de uma profissão. Não cria as tarefas de iniciação por onde as pessoas costumavam entrar, e é bem possível que as elimine. Produtividade e carreira são variáveis diferentes, e no ponto de entrada parecem estar a mover-se em sentidos opostos.

Alguém, um dia, apontou um cronómetro a um médico e descobriu que três quartos da medicina não são medicina. Esse único ato de medição fez mais trabalho neste argumento do que todas as previsões que ele contém. E respondeu a uma pergunta diferente, porque ninguém se tinha lembrado de fazer esta.

A pergunta certa é de quão pouco tempo humano uma peça de trabalho precisa realmente. É respondível. É respondível desde 1978. Ninguém a fez, e até que alguém a faça, a resposta honesta a quanto maior isto torna a economia é que não sabemos, e que quem lhe disser o contrário está a ler um hábito e a chamar-lhe lei.

[^1]: Amdahl formulou o argumento a propósito de processadores paralelos num artigo de quatro páginas na Spring Joint Computer Conference de 1967, contra a visão então em voga de que se podia sempre atirar mais processadores a um problema. O argumento generaliza-se a qualquer aceleração parcial, que é por isso que aparece em contextos que ele não reconheceria.

[^2]: Hunter e colegas apresentam dois conjuntos de valores, um para as pessoas que já estão na função e outro para o conjunto de pessoas que poderiam ser contratadas para ela, e 2,27 vem do segundo. Na maioria das ocupações o segundo é o maior, porque a contratação já removeu o fundo da distribuição. Para as profissões da amostra deles é apenas ligeiramente maior, porque recorreram a inquéritos nacionais que cobriam todo o campo e não lhe aplicaram correção nenhuma.

[^3]: Rimland e Larson, *Individual Differences: An Underdeveloped Opportunity for Military Psychology*, Journal of Applied Social Psychology 16, 1986. O folclore do programador dez vezes melhor é habitualmente atribuído a Sackman, Erikson e Grant em 1968. Rimland e Larson é a versão que chegou à literatura meta-analítica, e sobrevive nela sobretudo como um parêntesis dentro do artigo que a descartou.
