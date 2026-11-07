import { Page, Section, Text, Callout, Table, Bars, Properties, Button, LinkCards, useGrokTheme, useState, useMemo } from "./kit";

type Item = { id: string; g: string; s: string; o: [string, string][]; st?: number; c?: number };
type Ans = Record<string, number | string>;

const Q: Item[] = [
{id:"p1",g:"f",s:"到一座陌生城市的第一天，你最自然在做什么？",o:[["Ne","脑子里冒出一堆「这里还能干嘛」，想多拐几条没去过的街"],["Ni","在找这座城的「调子」，逛几小时后心里已经有一句对它的判断"],["Se","先被气味、声音、人流吸过去，身体已经在逛了"],["Si","拿它跟熟悉的地方比，先找到一个能落脚、有熟悉感的点"]]},
{id:"p2",g:"f",s:"你觉得一件事不对劲的时候，那个「不对劲」最先是怎么来的？",o:[["Ne","同时冒出好几种可能的解释，想一个个去验证"],["Ni","没什么证据，但已经有一个指向结局的预感"],["Se","眼前某个具体细节突然跳出来：表情、语气、东西摆的位置"],["Si","跟我以往的经验对不上：「以前不是这样的」"]]},
{id:"p3",g:"f",s:"看完一本书或一部片，最后留在你身上的是？",o:[["Ne","它让我联想到的别的点子，越想越远"],["Ni","背后那条主线，作者真正想说的那一句"],["Se","画面、声音、节奏打在身上的那种冲击"],["Si","某个细节勾起的私人回忆和身体感觉"]]},
{id:"p4",g:"f",s:"原定的计划突然被打乱，你第一反应是？",o:[["Ne","有点兴奋，新变量等于新玩法"],["Ni","先确认最终要去的地方还在不在，路线可以换"],["Se","立刻看现场手边有什么能直接拿来用"],["Si","不太舒服，想先把熟悉的步骤和节奏找回来"]]},
{id:"p5",g:"f",s:"学一样新技能，你通常怎么学？",o:[["Ne","东试西试，跳着学，边玩边找规律"],["Ni","先抓住核心原理，想一通百通"],["Se","直接上手，靠手感和即时反馈调整"],["Si","按步骤一遍遍练，练到稳为止"]]},
{id:"p6",g:"f",st:1,s:"和朋友闲聊时，你嘴里最常冒出来的是？",o:[["Ne","「说到这个我想到……」然后话题拐走了"],["Ni","「我感觉这事最后会变成……」"],["Se","吐槽眼前看得见摸得着的东西"],["Si","「我之前也遇到过一次……」"]]},
{id:"p7",g:"f",s:"想到「以后」，你脑子里是什么样？",o:[["Ne","一堆分岔路，每条都想去看看"],["Ni","模糊但有方向，像一个已经存在的画面"],["Se","以后的事以后说，现在抓得住的才算数"],["Si","希望以后跟过去一样可靠、可预期"]]},
{id:"p8",g:"f",s:"收拾桌面或房间时，你通常是？",o:[["Ne","收着收着翻到旧东西，开始想别的"],["Ni","只留真正要的，其他都无所谓"],["Se","看着顺眼、伸手顺手就行"],["Si","每样东西都有它固定的位置"]]},
{id:"p9",g:"f",s:"你一般怎么发现自己累了？",o:[["Ne","注意力散成碎片、开始乱跳的时候"],["Ni","很晚才意识到，脑子还在推演别的"],["Se","当下就很明显：饿了就吃，困了就倒"],["Si","对身体内部的小变化很敏感，早就察觉了"]]},
{id:"p10",g:"f",st:1,s:"第一次见一个人，你最先抓到的是？",o:[["Ne","他身上的反差和各种可能性"],["Ni","一个「这人是怎样的」直觉判断"],["Se","他的穿着、动作、气场、声音"],["Si","他像我认识的某个人"]]},
{id:"p11",g:"f",st:1,s:"自由安排一次旅行，你会？",o:[["Ne","不做计划，路上看到有意思的就改道"],["Ni","为了一个特别想看的核心体验去"],["Se","吃好吃的、玩刺激的，感官要满足"],["Si","去熟悉、喜欢的地方，舒服第一"]]},
{id:"p12",g:"f",s:"面对一个复杂问题，你的第一步通常是？",o:[["Ne","先发散，列出很多角度"],["Ni","收住，等一个洞察「咔」地出现"],["Se","先动手碰一下，看实际反应"],["Si","先找有没有类似的先例"]]},
{id:"j1",g:"f",st:1,s:"团队要拍板一件事，你最在意？",o:[["Te","能不能按时、有效地出结果"],["Ti","逻辑上站不站得住"],["Fe","大家能不能接受，气氛别崩"],["Fi","这件事跟我认同的东西对不对得上"]]},
{id:"j2",g:"f",s:"别人说你错了，你先做的是？",o:[["Te","拿数据和结果说话"],["Ti","在脑子里拆他的论证找漏洞"],["Fe","先看场面，别让谁下不来台"],["Fi","问自己心里是不是真觉得错了"]]},
{id:"j3",g:"f",s:"写一份方案，你最先花力气在？",o:[["Te","目标、分工、时间表"],["Ti","把定义讲清楚，框架自洽"],["Fe","读的人能不能共鸣、愿意配合"],["Fi","写进去的是不是我真心相信的东西"]]},
{id:"j4",g:"f",st:1,s:"朋友来找你哭诉，你自然会？",o:[["Te","帮他列出接下来能做的几步"],["Ti","帮他拆清楚问题到底出在哪"],["Fe","先陪着，把情绪接住"],["Fi","在心里想「换我会是什么感受」"]]},
{id:"j5",g:"f",s:"遇到一条你觉得不合理的规则？",o:[["Te","它没效率，就推动去改"],["Ti","它内部不自洽，我心里就不认"],["Fe","大家都被它弄得难受，就该改"],["Fi","它违背我的原则，我就不配合"]]},
{id:"j6",g:"f",s:"评价一个作品好不好，你看？",o:[["Te","它有没有达到目的，反响怎样"],["Ti","结构精不精巧，逻辑漂不漂亮"],["Fe","它打动了多少人"],["Fi","它是不是真诚"]]},
{id:"j7",g:"f",st:1,s:"跟人吵起来时，你更像？",o:[["Te","就事论事，要一个解决方案"],["Ti","纠正对方的用词和逻辑"],["Fe","察觉对方情绪，调整说法"],["Fi","守住底线，不在乎能不能说服他"]]},
{id:"j8",g:"f",s:"被要求做一件你不想做的事？",o:[["Te","算值不值，划算就做"],["Ti","先搞懂为什么要做"],["Fe","看拒绝会伤到谁"],["Fi","不想就是不想"]]},
{id:"j9",g:"f",s:"挑工作时，最能打动你的是？",o:[["Te","能拿到的资源、成长和成果"],["Ti","能自由钻研有意思的问题"],["Fe","团队氛围好，被需要"],["Fi","跟我是谁对得上"]]},
{id:"j10",g:"f",st:1,s:"要组织一次聚会，你会？",o:[["Te","定时间地点，分好工"],["Ti","懒得张罗，但会顺手优化方案"],["Fe","确保每个人都被照顾到"],["Fi","只叫真正想见的人"]]},
{id:"j11",g:"f",s:"你道歉的方式更像？",o:[["Te","直接给补救措施"],["Ti","说明我哪一步想错了"],["Fe","先表达我在乎对方的感受"],["Fi","只有我真觉得自己错才道歉"]]},
{id:"j12",g:"f",s:"刷到一则有争议的新闻？",o:[["Te","看有没有能落地的结论"],["Ti","先找各方论证的漏洞"],["Fe","看人群的情绪往哪边走"],["Fi","心里立刻有自己的道德立场"]]},
{id:"a1",g:"a",s:"手上有一个顺手的老办法，又冒出一个没试过的新点子？",o:[["Ne","忍不住想先试新点子"],["Si","先把老办法做熟、做稳"]]},
{id:"a2",g:"a",s:"回想一段往事时，你的脑子是？",o:[["Ne","顺着它跳到一堆不相关的联想"],["Si","重新体验当时的细节和身体感觉"]]},
{id:"a3",g:"a",s:"吃一顿很好吃的饭时，你更常是？",o:[["Se","在品味此刻的口感、温度和氛围"],["Ni","在想别的事，吃完才发现没注意味道"]]},
{id:"a4",g:"a",s:"哪个更像你？",o:[["Ni","比起现在发生了什么，我更在意它会通往哪里"],["Se","比起它会通往哪里，我更在意现在实际发生了什么"]]},
{id:"a5",g:"a",st:1,s:"小组讨论里，你更在乎？",o:[["Ti","把概念说准，哪怕气氛僵一点"],["Fe","大家都舒服，哪怕说得没那么准"]]},
{id:"a6",g:"a",s:"什么能让你改变看法？",o:[["Ti","被我自己的逻辑说服"],["Fe","看到在场的人普遍认同、受到影响"]]},
{id:"a7",g:"a",s:"决定一件事做不做，你先看？",o:[["Te","外部的标准、效果和代价"],["Fi","我心里认不认"]]},
{id:"a8",g:"a",s:"冲突僵住时，你更会？",o:[["Te","推进到一个能执行的解决办法"],["Fi","退回来守住自己的感受和立场"]]},
{id:"d1",g:"d",s:"哪个更像你平时的状态？",o:[["Pe","被外面正在发生的新东西拉着走"],["Pi","在消化脑子里已有的印象和画面"]]},
{id:"d2",g:"d",s:"信息量突然变大时？",o:[["Pe","越多越来劲"],["Pi","想先关掉，沉淀一下"]]},
{id:"d3",g:"d",s:"判断一件事对不对，你更依靠？",o:[["Je","外部的依据、标准和共识"],["Ji","我内部的框架或价值"]]},
{id:"d4",g:"d",s:"有了结论之后？",o:[["Je","直接推出去，影响周围"],["Ji","先在心里定好，不一定说出来"]]},
{id:"d5",g:"d",s:"开始一件新事时？",o:[["Pd","先看看、摸一摸，再决定"],["Jd","先定方向，再去收集需要的信息"]]},
{id:"d6",g:"d",st:1,s:"朋友更常怎么形容你？",o:[["Pd","随性、反应快、点子多或者手感好"],["Jd","有主见、拍板快、立场清楚"]]},
{id:"x1",g:"x",s:"碰到一个新东西，你通常先？",o:[["Pe","先去碰、去看、去试，看它还能怎么玩"],["Ji","先在心里拿自己的尺子量一量，值不值得"]]},
{id:"x2",g:"x",s:"一天下来，你的精力更多花在？",o:[["Pe","接收外面的新信息、新刺激"],["Ji","在心里分析、衡量这些东西对不对"]]},
{id:"x3",g:"x",s:"别人更常觉得你是？",o:[["Pe","先动起来、边走边看的人"],["Ji","心里有一套自己标准的人"]]},
{id:"x4",g:"x",s:"一件事刚摆到你面前，你更常？",o:[["Pi","先在脑子里消化，等一个整体印象成形"],["Je","先把事情安排、推进起来"]]},
{id:"x5",g:"x",st:1,s:"开会讨论时，你更像？",o:[["Pi","在想这件事的来龙去脉和走向"],["Je","在推动大家定下结论和分工"]]},
{id:"x6",g:"x",s:"压力大时，你先？",o:[["Pi","退回内心，回到熟悉的感受或画面里"],["Je","去整理外面：列清单、做决定"]]},
{id:"e1",g:"e",s:"一件很复杂的事结束后，你复盘是为了？",o:[["e5","弄清楚到底发生了什么"],["e8","看清局势，下一步把主动权拿回来"],["e1","检查自己有没有做到该有的标准"]]},
{id:"e2",g:"e",c:1,s:"有人越过你，替你做了本该你做的决定？",o:[["e8","不行，这是我的事，我要收回来"],["e9","算了，不值得起冲突，但心里记着"],["e6","先弄清他背后是谁、这样做会有什么后果"]]},
{id:"e3",g:"e",s:"一个人待了很久之后，你的感觉是？",o:[["e5","充好电了，精力留给真正重要的事"],["e9","舒服，不被打扰最好"],["e4","沉在自己的感受里，觉得别人不太懂我"]]},
{id:"e4",g:"e",c:1,s:"被人当面批评时，心里第一个念头？",o:[["e1","我哪里没做到自己的标准"],["e8","先看他凭什么评判我；说得对我拿去用，说得不对，我不会让这话来定义我"],["e3","形象受损了，得想办法把表现扳回来"]]},
{id:"e5",g:"e",s:"帮朋友一个大忙之后，你心里？",o:[["e2","希望他记得我的好"],["e9","能帮就帮，不想他为难"],["e6","这样彼此更靠得住，以后有个照应"]]},
{id:"e6",g:"e",s:"一个新项目刚开局，你最先想的是？",o:[["e7","好多可能性，好兴奋"],["e3","怎么做出一个亮眼的成绩"],["e4","想做出一个有我自己味道、跟别人不一样的东西"]]},
{id:"e7",g:"e",c:1,s:"身边有人情绪很激烈时？",o:[["e4","我好像也被带进那种感受里"],["e2","想马上去照顾、安慰他"],["e9","太重了，我想躲开一点"]]},
{id:"e8",g:"e",s:"你提前看到了一个风险？",o:[["e9","先别慌，多半没那么严重，等等看"],["e5","先去找资料，把它彻底搞懂"],["e1","觉得「本来就不该这样」，想去纠正"]]},
{id:"e9",g:"e",s:"闲下来、有点无聊时？",o:[["e7","马上找新乐子"],["e4","觉得生活少了点意义"],["e5","钻进某个感兴趣的知识里"]]},
{id:"e10",g:"e",c:1,s:"争论到一半，你较劲的点是？",o:[["e2","不想把关系弄僵，想先把气氛缓下来"],["e1","错的就是错的，我得把它纠正过来"],["e3","不能显得不专业，不能被看扁"]]},
{id:"e11",g:"e",s:"需要开口请别人帮忙时？",o:[["e1","不想欠人情，能自己做好的就自己做好"],["e2","很难开口，宁可先去帮别人"],["e5","能不麻烦人就不麻烦，自己慢慢弄"]]},
{id:"e12",g:"e",c:1,s:"被一套规定框住时？",o:[["e7","憋得难受，想找个口子溜出去"],["e8","推回去，我的事我自己定"],["e9","表面配合，私下慢慢拖"]]},
{id:"e13",g:"e",s:"一件事搞砸之后？",o:[["e3","赶紧换条路，再证明一次"],["e4","觉得这暴露了我骨子里的缺陷"],["e7","往好处想，下一个会更好"]]},
{id:"e14",g:"e",s:"面对一个新上司或权威人物？",o:[["e6","先试探他靠不靠得住，出事了会不会护着我们"],["e8","先看他会不会插手我的事，我说了算的地方还在不在"],["e5","先看他到底懂不懂行，要不要花精力应付他"]]},
{id:"e15",g:"e",c:1,s:"群里发生了一件不公平的事？",o:[["e8","站出来，替吃亏的那方扛"],["e2","私下去安慰受委屈的人"],["e6","先看大家站哪边，再决定怎么表态"]]},
{id:"e16",g:"e",s:"被人真心夸了一句？",o:[["e3","爽，说明我做到了"],["e2","开心，说明我对别人有用"],["e4","怀疑他没看到真正的我"]]},
{id:"e17",g:"e",s:"一个完全空着的周末？",o:[["e7","排满好玩的"],["e6","先把下周可能出岔子的事准备好，心里踏实了再玩"],["e1","先把该做的事做完再说"]]},
{id:"e18",g:"e",s:"发现有人很依赖你？",o:[["e6","多了一份责任，得先确认自己担得住"],["e3","说明我能干，有面子"],["e7","有点累，想保留自己的自由"]]},
{id:"i1",g:"i",s:"进入一个新环境，你先搞清楚的是？",o:[["sp","吃住在哪、怎么待得舒服"],["so","谁说了算、大家怎么相处"],["sx","最吸引我的那个人或那件事"]]},
{id:"i2",g:"i",s:"多出一笔闲钱，你最想花在？",o:[["sp","存起来，或者改善生活的底子"],["so","圈子活动、人情往来"],["sx","让我上头的东西或人"]]},
{id:"i3",g:"i",s:"内耗的时候，你脑子里转的是？",o:[["sp","生活乱了，得先睡好吃好找回掌控"],["so","我在别人眼里是什么位置"],["sx","某段关系、某个人，反复想"]]},
{id:"i4",g:"i",st:1,s:"在一场聚会上，你通常？",o:[["sp","找个舒服的地方，按需社交"],["so","在几个小圈子之间走动"],["sx","跟一个人聊得很深就够了"]]},
{id:"i5",g:"i",s:"一段关系里，你最怕？",o:[["sp","失去稳定和安全感"],["so","被排除在圈子之外"],["sx","变得平淡，没火花"]]},
{id:"i6",g:"i",s:"让你持续投入一件事的动力是？",o:[["sp","收入稳、条件好"],["so","被认可、有影响力"],["sx","有让我燃起来的东西"]]},
{id:"i7",g:"i",s:"你的空虚感多半来自？",o:[["sp","生活节奏乱掉"],["so","跟群体断了联系"],["sx","缺一个强烈的连接"]]},
{id:"i8",g:"i",s:"上网时你最常在？",o:[["sp","收藏实用信息和攻略"],["so","跟圈子动态和热门话题"],["sx","追着某个人或某部作品挖到底"]]},
{id:"i9",g:"i",s:"压力很大时，你最想要？",o:[["sp","一个安全的地方躲起来恢复"],["so","找朋友聚一聚，回到群里"],["sx","一场能把我点燃的对话或体验"]]}
];

type PItem = { id: string; a: string; b: string; s: string; o: [string, string][] };
const PP: [string, string, string, string, string][] = [
["e7","e8","朋友临时拉你去一个没去过的局，你先想的是？","去，新鲜就值得","先看我能不能自己决定什么时候走、怎么玩"],
["e7","e8","哪种状态更让你受不了？","被困在无聊里，没得选","被人管着，自己说了不算"],
["e6","e8","刚进一个陌生团队，你先确认的是？","谁靠得住，这里安不安全","我能自己做主的范围有多大"],
["e6","e8","你的判断被人质疑时，心里更像？","是不是哪里没想周全，会不会出事","这是我的判断，结果我自己担"],
["e6","e7","做一个大决定之前，你更常？","把可能出错的地方先想一遍","想想做成了会有多好玩"],
["e6","e7","焦虑上来的时候？","找人或找依据确认一下才安心","转移注意力，去做点开心的"],
["e5","e8","遇到一个很强势的人？","退开一点，保留自己的空间和精力","站在原地，我的界线我自己划"],
["e5","e8","你积累知识和能力，更多是为了？","把它搞懂，心里有底","能用它把局面握在自己手里"],
["e8","e9","别人的安排你不太同意？","说出来，按我的方式改","只要不太过分，就随它"],
["e8","e9","你的火气通常？","很快察觉，直接用来推进事情","很慢才察觉，常常压下去"],
["e6","e9","你躲开一场冲突时，心里是？","怕局面失控、怕被针对","不想被打扰，不想失去平静"],
["e6","e9","团队起了分歧？","先弄清各方立场和后果","希望大家都冷静，自己退到一边"],
["e1","e3","一件事做得好，你更在乎？","它是对的、合标准的","它被看见、被认可"],
["e1","e3","省了一步没人发现？","我自己会难受","结果好看就行"],
["e2","e4","共情一个人的时候？","想为他做点什么","想理解那种感受跟我自己的关系"],
["e2","e4","被忽视的时候，你想的是？","是不是我付出得不够","是不是我本来就不被理解"],
["e5","e6","心里没底的时候？","自己去查清楚","找靠得住的人或规则"],
["e5","e6","你更怕？","被耗干、被侵入","没有依靠、被丢下"],
["e5","e7","碰到一个新领域？","挑一个点钻到底","什么都尝一点"],
["e5","e7","一个人待久了？","是充电","会闷，想出去找点事"],
["e3","e7","让你做下去的动力？","拿得出手的成果","过程本身好玩"],
["e3","e7","一件事黄了，最刷你的是？","丢面子","扇兴、没意思了"],
["e3","e8","带一个项目，你更想？","做出亮眼的成绩","按我的判断去做，结果我担"],
["e3","e8","被人看轻时？","想证明给他看","他怎么看不影响我，我做我的"],
["e1","e6","你守一条规矩，是因为？","它本身是对的","守着更安全、有人护着"],
["e1","e6","犯了错之后？","怪自己没做到","担心后果和别人的反应"],
["e2","e9","帮别人的时候？","想被需要、被记住","顺手，不想闹得不愉快"],
["e2","e9","在一段关系里？","我主动靠近","我顺着对方的节奏"],
["e4","e7","低落的时候？","沉进去感受它","想办法逃出来"],
["e4","e7","你想要的生活？","深、有意义","多、有体验"],
["e4","e5","独处的时候你在？","品味自己的感受","想问题、理信息"],
["e4","e5","你更希望别人？","真正理解我","不来打扰我"],
["e7","e8","做决定时你更在意？","选项多，别把路堵死","决定权在我自己手里"],
["e6","e8","一件事出了岔子？","先找靠得住的人商量","我先把它接过来处理"],
["e6","e7","规划以后的时候？","先把后路留好","先想最想玩的是什么"],
["e5","e8","被卷进一场争执？","先抽身，在旁边看清楚","表明我的立场，我自己来定怎么处理"],
["e8","e9","别人想替你拿主意？","谢了，这事我自己定","他想定就让他定吧"],
["e6","e9","来了一条新规定？","先看它靠不靠谱、有没有坑","无所谓，跟着就行"],
["e1","e3","被要求赶工交差？","宁可慢一点也要做对","先交出一个好看的结果"],
["e2","e4","朋友难过的时候？","主动张罗，照顾他","陪他一起待在那种情绪里"],
["e5","e6","缺信息却要做决定？","先自己研究透","问问信得过的人"],
["e5","e7","一个空闲的周末？","一个人钻研某件事","出门找点新鲜的"],
["e3","e7","你更想被人说成？","很能干、很成功","很好玩、很自由"],
["e3","e8","在团队里你更在乎？","我的表现被看见","方向由我来定"],
["e1","e6","听到一个新建议？","先看它对不对","先看它稳不稳、有没有坑"],
["e2","e9","朋友找你帮忙，但你很累？","还是会去，他需要我","能推就推，只是不好意思直说"],
["e4","e7","回想过去时？","常带着一点怀念和遗憾","多半记得好玩的部分"],
["e4","e5","被人误解时？","很受伤，想让他懂我","无所谓，懒得解释"],
["e1","e2","你更容易对自己不满的是？","做得不够好、不够对","对别人不够好、不够体贴"],
["e1","e2","别人来求助时，你更想？","教他正确的做法","直接帮他做"],
["e1","e2","你最受不了别人说你？","不讲原则","自私冷漠"],
["e2","e3","你更想要？","被人需要","被人佩服"],
["e2","e3","在社交场合你更常？","照顾别人的需要","展示自己最好的一面"],
["e2","e3","付出没人看到时？","觉得心寒","觉得白费功夫"],
["e3","e4","做一个作品时？","要让人觉得厉害","要表达真实的我"],
["e3","e4","跟人比较时？","我想赢","我觉得自己缺了点什么"],
["e3","e4","关于形象？","可以按场合调整","不想为别人改变自己"],
["e1","e9","看到不对的事？","忍不住想纠正","不想为这个起波澜"],
["e1","e9","你的不满通常？","一直挂在心上","过一阵就淡了"],
["e1","e9","一天的节奏？","按该做的来","按舒服的来"],
["e3","e5","学一样东西是为了？","用得上、拿得出成果","真正搞懂它"],
["e3","e5","到了人多的场合？","很快进入状态","很快想找个角落"],
["e3","e5","你更怕？","失败被人看到","自己无能、不懂"],
["e4","e6","不安的时候？","觉得自己跟别人不一样，没人懂","担心会出什么事"],
["e4","e6","面对权威？","不太在乎，我按自己的感觉来","又想依靠又想质疑"],
["e4","e6","你更常问自己？","我到底是谁","我能信谁"],
["e7","e9","你放松的方式？","找新鲜、刺激的事","躺平，什么都不想"],
["e7","e9","碰到不愉快的事？","转到开心的事上","让它慢慢淡掉，不去碰"],
["e7","e9","计划很多的时候？","兴奋，都想做","累，想少一点"],
["e1","e8","你更像？","按原则办事的人","按自己判断办事的人"],
["e1","e8","生气的时候？","憋着，觉得应该克制","说出来，说完就翻篇"],
["e1","e8","规则和你的判断冲突时？","规则对就守，不对就该改规则","先按我的判断来，后果我自己担"]
];
const PO: PItem[] = PP.map((p: [string, string, string, string, string], i: number) => ({ id: `po${i + 1}`, a: p[0], b: p[1], s: p[2], o: [[p[0], p[3]], [p[1], p[4]]] as [string, string][] }));
const pk2 = (a: string, b: string): string => [a, b].sort().join("-");

const FN = ["Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"];
const TYPES: Record<string, string[]> = { ENTP: ["Ne","Ti","Fe","Si"], ENFP: ["Ne","Fi","Te","Si"], INTP: ["Ti","Ne","Si","Fe"], ISTP: ["Ti","Se","Ni","Fe"], ESTP: ["Se","Ti","Fe","Ni"], ESFP: ["Se","Fi","Te","Ni"], INFP: ["Fi","Ne","Si","Te"], ISFP: ["Fi","Se","Ni","Te"], ENTJ: ["Te","Ni","Se","Fi"], ESTJ: ["Te","Si","Ne","Fi"], INTJ: ["Ni","Te","Fi","Se"], INFJ: ["Ni","Fe","Ti","Se"], ENFJ: ["Fe","Ni","Se","Ti"], ESFJ: ["Fe","Si","Ne","Ti"], ISTJ: ["Si","Te","Fi","Ne"], ISFJ: ["Si","Fe","Ti","Ne"] };
const AXOF: Record<string, string> = { Ne: "NeSi", Si: "NeSi", Ni: "NiSe", Se: "NiSe", Ti: "TiFe", Fe: "TiFe", Te: "TeFi", Fi: "TeFi" };
const AXN: Record<string, string> = { NeSi: "Ne-Si 轴", NiSe: "Ni-Se 轴", TiFe: "Ti-Fe 轴", TeFi: "Te-Fi 轴" };
const EN = ["e1","e2","e3","e4","e5","e6","e7","e8","e9"];
const INS = ["sp", "so", "sx"];
const GL: Record<string, string> = { f: "八维", a: "八维·轴内", d: "八维·方向", x: "八维·先后", e: "九型", i: "本能" };

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function shuffle<T>(arr: T[], r: () => number): T[] { const b = arr.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = b[i]; b[i] = b[j]; b[j] = t; } return b; }

function score(ans: Ans) {
  const pk: Record<string, number> = {}; const ap: Record<string, number> = {};
  const att: Record<string, number> = { Pe: 0, Pi: 0, Je: 0, Ji: 0, Pd: 0, Jd: 0, xPe: 0, xPi: 0, xJe: 0, xJi: 0 };
  const isum: Record<string, number> = {}; const il: Record<string, number> = {};
  const er: Record<string, number> = {}; const em: Record<string, number> = {}; const ea: Record<string, number> = {}; const es: Record<string, number> = {};
  const ir: Record<string, number> = {}; const im: Record<string, number> = {}; const ia: Record<string, number> = {}; const is: Record<string, number> = {};
  let idk = 0, idkC = 0, fun = 0, comfy = 0, styE = 0, done = 0;
  for (const q of Q) {
    const a = ans[q.id];
    if (a === undefined) continue;
    done++;
    if (q.st) { styE++; if (a === "fun") { fun++; continue; } if (a === "comfy") { comfy++; continue; } }
    if (q.g === "f" || q.g === "a") { if (typeof a === "number") { q.o.forEach((o: [string, string]) => { ap[o[0]] = (ap[o[0]] || 0) + 1; }); pk[q.o[a][0]] = (pk[q.o[a][0]] || 0) + 1; } }
    else if (q.g === "d") { if (typeof a === "number") att[q.o[a][0]]++; }
    else if (q.g === "x") { if (typeof a === "number") att["x" + q.o[a][0]]++; }
    else if (q.g === "i") {
      if (a === "idk") { q.o.forEach((o: [string, string]) => { im[o[0]] = (im[o[0]] || 0) + 1; }); continue; }
      q.o.forEach((o: [string, string]) => { ia[o[0]] = (ia[o[0]] || 0) + 1; if (a === "none") { ir[o[0]] = (ir[o[0]] || 0) + 1; isum[o[0]] = (isum[o[0]] || 0) - 0.25; } });
      if (typeof a === "number") { const pkk = q.o[a][0]; is[pkk] = (is[pkk] || 0) + 1; isum[pkk] = (isum[pkk] || 0) + 1; const lv = ans[q.id + "_l"]; const lk = typeof lv === "number" && lv !== a ? q.o[lv][0] : ""; if (lk) il[lk] = (il[lk] || 0) + 1; q.o.forEach((o: [string, string], j: number) => { if (j === a || o[0] === lk) return; isum[o[0]] = (isum[o[0]] || 0) + (lk ? 0.5 : 0.25); }); }
    }
    else {
      const isE = q.g === "e"; const R = isE ? er : ir; const M = isE ? em : im; const A = isE ? ea : ia; const S = isE ? es : is;
      if (a === "idk") { if (isE) { idk++; if (q.c) idkC++; } q.o.forEach((o: [string, string]) => { M[o[0]] = (M[o[0]] || 0) + 1; }); continue; }
      q.o.forEach((o: [string, string]) => { const k = o[0]; A[k] = (A[k] || 0) + 1; if (a === "none") R[k] = (R[k] || 0) + 1; });
      if (typeof a === "number") { const k = q.o[a][0]; S[k] = (S[k] || 0) + 1; }
    }
  }
  const f: Record<string, number> = {}; FN.forEach((k: string) => { f[k] = ap[k] ? Math.round(100 * (pk[k] || 0) / ap[k]) : 0; });
  const ar = (x: string, y: string): number => (att[x] + att[y] ? 100 * att[x] / (att[x] + att[y]) : 50);
  const ax: Record<string, number> = { NeSi: (f.Ne + f.Si) / 2, NiSe: (f.Ni + f.Se) / 2, TiFe: (f.Ti + f.Fe) / 2, TeFi: (f.Te + f.Fi) / 2 };
  const ts = Object.keys(TYPES).map((t: string) => {
    const [D, A, T, I] = TYPES[t];
    const isP = "NS".includes(D[0]); const ext = D[1] === "e";
    const dAtt = isP ? (ext ? ar("Pe", "Pi") : ar("Pi", "Pe")) : (ext ? ar("Je", "Ji") : ar("Ji", "Je"));
    const dPJ = isP ? ar("Pd", "Jd") : ar("Jd", "Pd");
    const dk = (isP ? "P" : "J") + (ext ? "e" : "i"); const ak = (isP ? "J" : "P") + (ext ? "i" : "e");
    const xr = ar("x" + dk, "x" + ak);
    let v = 0.36 * f[D] + 0.26 * f[A] + 0.08 * f[T] + 0.02 * f[I] + 0.04 * ax[AXOF[D]] + 0.03 * ax[AXOF[A]] + 0.07 * dAtt + 0.02 * dPJ + 0.12 * xr;
    if (f[D] < 15 || f[A] < 15) v *= 0.6;
    return { t, s: TYPES[t], v: Math.round(v * 10) / 10 };
  }).sort((x: { v: number }, y: { v: number }) => y.v - x.v);
  const rate = (S: Record<string, number>, N: Record<string, number>, A: Record<string, number>, keys: string[]): Record<string, number> => { const o: Record<string, number> = {}; keys.forEach((k: string) => { o[k] = A[k] ? Math.max(0, Math.round(100 * ((S[k] || 0) - 0.25 * (N[k] || 0)) / A[k])) : 0; }); return o; };
  return { f, ax, att, ts, e: rate(es, er, ea, EN), ea, es, en: er, ek: em, i: (() => { const o: Record<string, number> = {}; INS.forEach((k: string) => { o[k] = ia[k] ? Math.max(0, Math.round(100 * (isum[k] || 0) / ia[k])) : 0; }); return o; })(), ia, is, il, inn: ir, ik: im, idk, idkC, fun, comfy, styE, done };
}

const MIN_N = 4;
const GAP = 15;

export default function App() {
  const theme = useGrokTheme();
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1e9));
  const [ans, setAns] = useState<Ans>({});
  const order = useMemo(() => { const r = rng(seed); return shuffle(Q, r).map((q: Item) => ({ q, opts: shuffle(q.o.map((o: [string, string], i: number) => ({ i, t: o[1] })), r) })); }, [seed]);
  const R = useMemo(() => score(ans), [ans]);
  const poOrder = useMemo(() => { const r = rng(seed + 7); return shuffle(PO, r).map((p: PItem) => (r() < 0.5 ? { ...p, o: [p.o[1], p.o[0]] as [string, string][] } : p)); }, [seed]);
  const setA = (id: string, v: number | string) => { const n: Ans = { ...ans }; if (n[id] === v) delete n[id]; else n[id] = v; setAns(n); };
  const reset = () => { setAns({}); setSeed(Math.floor(Math.random() * 1e9)); };

  const card = (sel: boolean) => ({ display: "block", width: "100%", boxSizing: "border-box" as const, textAlign: "left" as const, whiteSpace: "normal" as const, wordBreak: "break-word" as const, padding: "10px 12px", marginTop: 8, borderRadius: 8, border: `1px solid ${sel ? theme.border.focus : theme.border.default}`, background: sel ? theme.fill.accentSubtle : theme.bg.base, color: theme.text.primary, fontFamily: theme.font.family, fontSize: theme.font.body2.fontSize, lineHeight: theme.font.body2.lineHeight, cursor: "pointer" });
  const chip = (sel: boolean) => ({ padding: "6px 10px", borderRadius: 9999, border: `1px solid ${sel ? theme.border.focus : theme.border.weak}`, background: sel ? theme.fill.accentSubtle : "transparent", color: theme.text.secondary, fontFamily: theme.font.family, fontSize: theme.font.label.fontSize, cursor: "pointer", whiteSpace: "normal" as const });

  // MBTI headline
  const top = R.ts[0], sec = R.ts[1];
  const fnDone = Q.filter((q: Item) => (q.g === "f" || q.g === "a") && typeof ans[q.id] === "number").length;
  const gapT = Math.round((top.v - sec.v) * 10) / 10;
  const twin = R.ts.find((t: { s: string[] }) => t.s[0] === top.s[1] && t.s[1] === top.s[0]) || sec;
  const other = R.ts.slice(1).find((t: { t: string }) => t.t !== twin.t) || sec;
  const gapO = Math.round((top.v - other.v) * 10) / 10; const gapW = Math.round((top.v - twin.v) * 10) / 10;
  const locked = fnDone >= 20 && gapO >= 5 && gapW >= 3;
  const mbti = fnDone < 20 ? `八维题答了 ${fnDone}/32，先别看` : locked ? `${top.t}（${top.s.join("-")}）` : gapO >= 5 ? `${top.t} / ${twin.t} 待定（主辅先后没分开）` : `${top.t} / ${other.t} 待定`;
  const auxLow = fnDone >= 20 && R.f[top.s[1]] < 35;

  // Enneagram
  const eRank = EN.filter((k: string) => (R.ea[k] || 0) >= MIN_N).sort((x: string, y: string) => R.e[y] - R.e[x]);
  const nm = (k: string) => k.slice(1);
  const h2h = (a: string, b: string): { x: number; y: number } => { let x = 0, y = 0; PO.forEach((p: PItem) => { if (pk2(p.a, p.b) !== pk2(a, b)) return; const v = ans[p.id]; if (typeof v !== "number") return; if (p.o[v][0] === a) x++; else y++; }); return { x, y }; };
  const hw = (a: string, b: string): number => { const r = h2h(a, b); return r.x > r.y ? 1 : r.x < r.y ? -1 : 0; };
  const eDone = Q.filter((q: Item) => q.g === "e" && ans[q.id] !== undefined).length;
  const ready = eDone >= 15 && eRank.length >= 2;
  const cont = ready ? eRank.filter((k: string) => R.e[eRank[0]] - R.e[k] < GAP).slice(0, 4) : [];
  const needPairs: string[] = [];
  const addPair = (a: string, b: string): boolean => { const k = pk2(a, b); if (!needPairs.includes(k) && PO.some((p: PItem) => pk2(p.a, p.b) === k)) needPairs.push(k); return true; };
  for (let i = 0; i < cont.length; i++) for (let j = i + 1; j < cont.length; j++) addPair(cont[i], cont[j]);
  const cop: Record<string, number> = {};
  cont.forEach((k: string) => { cop[k] = 0; cont.forEach((o: string) => { if (o !== k) cop[k] += hw(k, o); }); });
  let eMain = ""; let viaPO = false;
  if (eRank.length >= 2 && R.e[eRank[0]] - R.e[eRank[1]] >= GAP) eMain = eRank[0];
  else if (cont.length >= 2) { const cs = cont.slice().sort((x: string, y: string) => cop[y] - cop[x]); if (cop[cs[0]] > cop[cs[1]]) { eMain = cs[0]; viaPO = true; } }
  const mainTxt = eRank.length < 2 ? "九型题还不够" : eMain ? `${nm(eMain)} 号${viaPO ? "（加赛胜出）" : ""}` : cont.length >= 2 ? `${cont.map(nm).join(" / ")} 待定，做下方加赛` : `${nm(eRank[0])} 与 ${nm(eRank[1])} 待定（九型题答满 15 题后开加赛）`;
  const wr = (k: string, core: string): number => { let A = 0, S = 0, N = 0; Q.forEach((q: Item) => { if (q.g !== "e") return; const ks = q.o.map((o: [string, string]) => o[0]); if (!ks.includes(k) || ks.includes(core)) return; const v = ans[q.id]; if (v === undefined || v === "idk") return; A++; if (v === "none") N++; else if (typeof v === "number" && ks[v] === k) S++; }); return A ? Math.max(0, Math.round(100 * (S - 0.25 * N) / A)) : 0; };
  let wingTxt = "";
  if (eMain) { const n = +nm(eMain); const l = `e${n === 1 ? 9 : n - 1}`, r = `e${n === 9 ? 1 : n + 1}`; const d = wr(l, eMain) - wr(r, eMain); wingTxt = Math.abs(d) >= GAP ? `${n}w${nm(d > 0 ? l : r)}` : (ready && addPair(l, r) && hw(l, r) !== 0) ? `${n}w${nm(hw(l, r) > 0 ? l : r)}（加赛）` : `${n}w?（${nm(l)} 和 ${nm(r)} 差不到 ${GAP}）`; }
  const centers = [["e8", "e9", "e1"], ["e2", "e3", "e4"], ["e5", "e6", "e7"]];
  const triParts = centers.map((c: string[]) => { const s = c.slice().sort((x: string, y: string) => R.e[y] - R.e[x]); if (eMain && c.includes(eMain)) return { k: eMain, v: 1000, lock: true, alt: eMain };
    let k = s[0], alt = s[1], lock = R.e[s[0]] - R.e[s[1]] >= GAP;
    if (!lock && ready) { addPair(s[0], s[1]); const w = hw(s[0], s[1]); if (w !== 0) { lock = true; if (w < 0) { k = s[1]; alt = s[0]; } } }
    return { k, v: R.e[k], lock, alt }; }).sort((x: { v: number }, y: { v: number }) => y.v - x.v);
  const tri = triParts.map((p: { k: string; lock: boolean; alt: string }) => p.lock ? nm(p.k) : `(${nm(p.k)}/${nm(p.alt)})`).join("");

  // Instinct
  const iS = INS.slice().sort((x: string, y: string) => R.i[y] - R.i[x]);
  const iN = INS.reduce((s: number, k: string) => s + (R.is[k] || 0), 0);
  const iTxt = iN < 5 ? "本能题还不够" : `${iS[0]}${R.i[iS[0]] - R.i[iS[1]] >= GAP ? "" : "?"}/${iS[1]}${R.i[iS[1]] - R.i[iS[2]] >= GAP ? "" : "?"}`;

  // warnings
  const warn: string[] = [];
  if (auxLow) warn.push(`辅助功能 ${top.s[1]} 只有 ${R.f[top.s[1]]}，这个栈的第二位撑不住，类型先当草稿。`);
  if (R.e.e8 >= 50 && R.e.e5 >= 50 && Math.abs(R.e.e8 - R.e.e5) < GAP) warn.push("8 和 5 咬得很紧：看复盘、求助、权威那几题，你是为了「拿回主动」还是为了「先搞懂再说」。");
  if (R.e.e8 >= 70 && R.e.e9 >= 50) warn.push("8 高同时 9 也高：可能是 8 的「懒得为小事浪费力气」被记成了 9 的回避，去看冲突题。");
  if (R.idk >= 3 && R.idkC / R.idk >= 0.5) warn.push(`「我不知道」有 ${R.idkC}/${R.idk} 落在冲突题：留意 9（不想起冲突）和 6（先看后果再表态）。分数没动。`);
  if (R.e.e4 >= 50 && R.f.Fe >= 50) warn.push("4 号和 Fe 同时高：被别人情绪带走可能是 Fe 的共振，不一定是 4 的身份感。");
  if (R.e.e6 >= 50 && R.f.Ni >= 50) warn.push("6 号和 Ni 同时高：预感风险可能来自 Ni 的收敛，不一定是 6 的不安全感。");
  if (R.e.e6 >= 50 && R.f.Si >= 50 && R.f.Ne >= 50) warn.push("6 号、Si、Ne 都高：压力下抠细节可能是劣势 Si，不等于 Si 主导。");
  if (R.e.e1 >= 50 && R.e.e3 >= 50 && Math.abs(R.e.e1 - R.e.e3) < GAP) warn.push("1 和 3 分不开：被批评时是在对照内心标准，还是在担心形象？");
  const styleShare = R.styE ? Math.round(100 * (R.fun + R.comfy) / R.styE) : 0;
  if (R.styE >= 4 && styleShare >= 50) warn.push(`社交/自由题里有 ${styleShare}% 选了「看情况」的风格项，这类场景你的答案不稳定。`);

  const sketch = `【人设速写】\n八维：${mbti}${locked ? "" : "（差距不足 5 分，未锁）"}\n功能轴：Ne-Si ${R.ax.NeSi.toFixed(0)}｜Ni-Se ${R.ax.NiSe.toFixed(0)}｜Ti-Fe ${R.ax.TiFe.toFixed(0)}｜Te-Fi ${R.ax.TeFi.toFixed(0)}\n九型：${mainTxt}${wingTxt ? "，翼 " + wingTxt : ""}，三元 ${tri}\n本能：${iTxt}\n风格：更有意思 ${R.fun} 次 / 更舒服 ${R.comfy} 次\n${warn.length ? "提醒：" + warn.join(" ") : "无污染提醒"}`;

  return (
    <Page title="人设类型学合测 · 轴向版" lang="zh-Hans" summary={`同一场景、几个方向正面竞争：八维按功能轴和主导方向排栈，九型和本能按动机三选一、按选中率计分。共 ${Q.length} 题，每次打开和重置都会打乱题目和选项顺序。`}>
      <Section heading="怎么答">
        <Text>选最像你平常、而不是理想中的那个。九型和本能题另有「我不知道」（不计分）和「都不是」（三个方向各扣一点）。社交、团队、自由安排类的题多两个按钮：「我做更有意思那个」「我做更让我舒服那个」，不计入功能分。本能题选完「最像」后，还可以再点一个「最不像」，用来排第二、第三。</Text>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          <Button label="重置并重新打乱" onClick={reset} />
          <span style={{ color: theme.text.secondary, fontSize: theme.font.label.fontSize }}>{`已答 ${R.done}/${Q.length}`}</span>
        </div>
      </Section>
      <Section heading="题目">
        {order.map((row: { q: Item; opts: { i: number; t: string }[] }, n: number) => {
          const q = row.q; const a = ans[q.id]; const three = q.g === "e" || q.g === "i";
          return (
            <div key={q.id} style={{ padding: "14px 0", borderBottom: `1px solid ${theme.border.subtle}` }}>
              <div style={{ color: theme.text.tertiary, fontSize: theme.font.label.fontSize }}>{`${n + 1} · ${GL[q.g]}`}</div>
              <div style={{ color: theme.text.primary, fontSize: theme.font.body1.fontSize, lineHeight: theme.font.body1.lineHeight, marginTop: 4, wordBreak: "break-word" }}>{q.s}</div>
              {row.opts.map((op: { i: number; t: string }) => (
                <div key={op.i} role="button" onClick={() => setA(q.id, op.i)} style={card(a === op.i)}>{op.t}</div>
              ))}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {q.st ? <span role="button" onClick={() => setA(q.id, "fun")} style={chip(a === "fun")}>我做更有意思那个</span> : null}
                {q.st ? <span role="button" onClick={() => setA(q.id, "comfy")} style={chip(a === "comfy")}>我做更让我舒服那个</span> : null}
                {three ? <span role="button" onClick={() => setA(q.id, "idk")} style={chip(a === "idk")}>我不知道</span> : null}
                {q.g === "i" && typeof a === "number" ? row.opts.filter((op: { i: number; t: string }) => op.i !== a).map((op: { i: number; t: string }) => <span key={"l" + op.i} role="button" onClick={() => setA(q.id + "_l", op.i)} style={chip(ans[q.id + "_l"] === op.i)}>{`最不像：${op.t}`}</span>) : null}
                <span role="button" onClick={() => setA(q.id, "none")} style={chip(a === "none")}>都不是</span>
              </div>
            </div>
          );
        })}
      </Section>
      {needPairs.length > 0 ? (
        <Section heading="九型加赛" caption="只在分数差不到 15 时出现；只用来分胜负，不改上面的选中率">
          {poOrder.filter((p: PItem) => needPairs.includes(pk2(p.a, p.b))).map((p: PItem, n: number) => {
            const a = ans[p.id];
            return (
              <div key={p.id} style={{ padding: "14px 0", borderBottom: `1px solid ${theme.border.subtle}` }}>
                <div style={{ color: theme.text.tertiary, fontSize: theme.font.label.fontSize }}>{`加赛 ${n + 1}`}</div>
                <div style={{ color: theme.text.primary, fontSize: theme.font.body1.fontSize, lineHeight: theme.font.body1.lineHeight, marginTop: 4, wordBreak: "break-word" }}>{p.s}</div>
                {p.o.map((o: [string, string], i: number) => (
                  <div key={i} role="button" onClick={() => setA(p.id, i)} style={card(a === i)}>{o[1]}</div>
                ))}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  <span role="button" onClick={() => setA(p.id, "none")} style={chip(a === "none")}>都不像</span>
                </div>
              </div>
            );
          })}
          <Table columns={["对局", "比分", "胜方"]} rows={needPairs.map((k: string) => { const [a, b] = k.split("-"); const r = h2h(a, b); return [`${nm(a)} 对 ${nm(b)}`, `${r.x} : ${r.y}`, r.x === r.y ? "平" : `${nm(r.x > r.y ? a : b)} 号`]; })} align={["start", "end", "end"]} />
        </Section>
      ) : null}
      <Section heading="结果">
        <Properties items={[
          { label: "八维", value: `${mbti}（领先其他类型 ${gapO} 分、领先内外向孪生 ${gapW} 分；${locked ? "已锁" : "要求 5 分和 3 分"}）` },
          { label: "九型主型", value: mainTxt },
          { label: "翼型", value: wingTxt || "主型未锁，不判翼" },
          { label: "三元组", value: tri },
          { label: "本能堆叠", value: iTxt },
        ]} />
      </Section>
      {warn.length > 0 ? (
        <Section heading="污染提醒">
          <Callout tone="warning">{warn.join(" ")}</Callout>
        </Section>
      ) : null}
      <Section heading="栈的候选" caption="栈分 = 主导 40% + 辅助 30% + 第三 10% + 劣势 3% + 轴 9% + 方向题 11%；主导或辅助低于 15 的栈打 6 折">
        <Table columns={["类型", "栈", "栈分"]} rows={R.ts.slice(0, 5).map((t: { t: string; s: string[]; v: number }) => [t.t, t.s.join("-"), String(t.v)])} align={["start", "start", "end"]} />
      </Section>
      <Section heading="八维选中率">
        <Bars bars={FN.slice().sort((x: string, y: string) => R.f[y] - R.f[x]).map((k: string) => ({ label: k, value: R.f[k], display: `${R.f[k]}` }))} />
        <Table columns={["功能轴", "轴分"]} rows={Object.keys(R.ax).map((k: string) => [AXN[k], R.ax[k].toFixed(0)])} align={["start", "end"]} />
      </Section>
      <Section heading="九型选中率" caption="分 = 100 × (选中 − 0.25 × 都不是) ÷ 有效出现；有效出现 = 出现 − 不知道；有效出现少于 4 的型不排名">
        <Table columns={["型", "分", "选中", "都不是", "不知道", "出现"]} rows={EN.slice().sort((x: string, y: string) => R.e[y] - R.e[x]).map((k: string) => [`${nm(k)} 号`, String(R.e[k]), String(R.es[k] || 0), String(R.en[k] || 0), String(R.ek[k] || 0), String((R.ea[k] || 0) + (R.ek[k] || 0))])} align={["start", "end", "end", "end", "end", "end"]} />
      </Section>
      <Section heading="本能选中率">
        <Table columns={["本能", "分", "最像", "最不像", "都不是", "不知道", "出现"]} rows={iS.map((k: string) => [k, String(R.i[k]), String(R.is[k] || 0), String(R.il[k] || 0), String(R.inn[k] || 0), String(R.ik[k] || 0), String((R.ia[k] || 0) + (R.ik[k] || 0))])} align={["start", "end", "end", "end", "end", "end", "end"]} />
      </Section>
      <Section heading="角色人设速写" caption="可直接复制">
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: theme.font.mono, fontSize: theme.font.code.fontSize, color: theme.text.primary, padding: 12, border: `1px solid ${theme.border.default}`, borderRadius: 8, userSelect: "all" }}>{sketch}</div>
      </Section>
      <Section heading="出题参考">
        <LinkCards links={[
          { title: "Sakinorva 认知功能测试（轴向算法）", site: "sakinorva.net", href: "https://sakinorva.net/functions" },
          { title: "IDRlabs 认知功能测试", site: "idrlabs.com", href: "https://www.idrlabs.com/cognitive-function/test.php" },
          { title: "Sakinorva 与 Keys2Cognition 的效度对比", site: "typologytriad.wordpress.com", href: "https://typologytriad.wordpress.com/2020/06/16/tcf-series-part-2-evaluating-sakinorva-and-keys2cognition-test/" },
          { title: "RHETI：成对强迫选择", site: "enneagraminstitute.com", href: "https://www.enneagraminstitute.com/rheti/" },
          { title: "IVQ：三选一本能问卷", site: "enneagraminstitute.com", href: "https://www.enneagraminstitute.com/ivq/" },
        ]} />
      </Section>
    </Page>
  );
}
