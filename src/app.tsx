import { Page, useState, useMemo, useEffect, useRef, type ChangeEvent, type CSSProperties } from "./kit";

type Item = { id: string; g: string; s: string; o: [string, string][]; st?: number; c?: number };
type Ans = Record<string, number | string>;

const Q: Item[] = [
{id:"p1",g:"f",s:"到一座陌生城市的第一天，你最自然在做什么？",o:[["Ne","脑子里冒出一堆「这里还能干嘛」，想多拐几条没去过的街"],["Ni","逛几个小时，心里就冒出一句话，能说清这座城是什么样"],["Se","先被街上的气味、声音、人流吸过去，看到想吃想玩的马上就去"],["Si","注意到很多具体的东西：物价、路牌、天气冷热，心里拿住惯的地方一项项对照"]]},
{id:"p2",g:"f",s:"你觉得一件事不对劲的时候，那个「不对劲」最先是怎么来的？",o:[["Ne","同时冒出好几种可能的解释，想一个个去验证"],["Ni","没什么证据，但已经有一个指向结局的预感"],["Se","当场就感觉到气氛变了，人一下子警觉起来，马上看向那边"],["Si","某个细节跟平时不一样：他今天的语气、东西摆的位置、自己身上哪里不对劲"]]},
{id:"p3",g:"f",s:"看完一本书或一部片，最后留在你身上的是？",o:[["Ne","它让我联想到的别的点子，越想越远"],["Ni","背后那条主线，作者真正想说的那一句"],["Se","画面、声音、节奏打在身上的那种冲击"],["Si","一些具体细节：某句台词、某个场景的样子，过很久还记得清清楚楚"]]},
{id:"p4",g:"f",s:"原定的计划突然被打乱，你第一反应是？",o:[["Ne","有点兴奋，新变量等于新玩法"],["Ni","先确认最终要去的地方还在不在，路线可以换"],["Se","当场看眼下冒出了什么机会，抓住就动"],["Si","先看具体哪几处变了，其余的尽量照原来习惯的样子走"]]},
{id:"p5",g:"f",s:"学一样新技能，你通常怎么学？",o:[["Ne","东试西试，跳着学，边玩边找规律"],["Ni","先抓住核心原理，想一通百通"],["Se","直接上手，靠手感和即时反馈调整"],["Si","按步骤一遍遍练，记住每一步做对时是什么样、什么感觉，练到稳为止"]]},
{id:"p6",g:"f",st:1,s:"和朋友闲聊时，你嘴里最常冒出来的是？",o:[["Ne","「说到这个我想到……」然后话题拐走了"],["Ni","「我感觉这事最后会变成……」"],["Se","拿眼前看到、听到的东西当场开玩笑"],["Si","「上次我也碰到过，当时是……」连细节都说得出来"]]},
{id:"p7",g:"f",s:"想到「以后」，你脑子里是什么样？",o:[["Ne","一堆分岔路，每条都想去看看"],["Ni","说不出细节，但心里大概知道最后会走到哪一步"],["Se","不太往那儿想，眼前正在发生的事和冒出来的机会更吸引我"],["Si","希望日子跟现在差不多稳：作息、住的地方、身边的人别大变"]]},
{id:"p8",g:"f",s:"收拾桌面或房间时，你通常是？",o:[["Ne","收着收着翻到旧东西，开始想别的"],["Ni","只留真正要的，其他都无所谓"],["Se","平时随手放，哪天看着不顺眼了，一口气全收完"],["Si","每样东西都有固定位置，谁动过我一眼就看得出来"]]},
{id:"p9",g:"f",s:"你一般怎么发现自己累了？",o:[["Ne","注意力散成碎片、开始乱跳的时候"],["Ni","很晚才意识到，脑子还在推演别的"],["Se","手上、身上还在忙着玩着，一停下来才一下子垮掉"],["Si","身体先给信号：肩膀发紧、胃口变了，跟平时状态不一样就知道了"]]},
{id:"p10",g:"f",st:1,s:"第一次见一个人，你最先抓到的是？",o:[["Ne","他身上的反差和各种可能性"],["Ni","一个「这人是怎样的」直觉判断"],["Se","他整个人当下带来的冲击：气场强不强、声音大不大、一进门有没有存在感"],["Si","他的穿着打扮、说话用词、举止小细节，心里默默跟平常见惯的人比"]]},
{id:"p11",g:"f",st:1,s:"自由安排一次旅行，你会？",o:[["Ne","不做计划，路上看到有意思的就改道"],["Ni","为了一个特别想看的核心体验去"],["Se","吃好吃的、玩刺激的，感官要满足"],["Si","回喜欢过的地方，把记得的那家店、那条街再走一遍"]]},
{id:"p12",g:"f",s:"面对一个复杂问题，你的第一步通常是？",o:[["Ne","先发散，列出很多角度"],["Ni","先不急着动，等自己突然想通关键在哪"],["Se","先动手碰一下，看实际反应"],["Si","先把具体情况一条条看清，跟正常时候的样子对一对，看哪里不一样"]]},
{id:"j1",g:"f",st:1,s:"团队要拍板一件事，你最在意？",o:[["Te","能不能按时、有效地出结果"],["Ti","逻辑上站不站得住"],["Fe","大家能不能接受，气氛别崩"],["Fi","这件事跟我认同的东西对不对得上"]]},
{id:"j2",g:"f",s:"别人说你错了，你先做的是？",o:[["Te","拿数据和结果说话"],["Ti","在脑子里拆他的论证找漏洞"],["Fe","先看场面，别让谁下不来台"],["Fi","问自己心里是不是真觉得错了"]]},
{id:"j3",g:"f",s:"写一份方案，你最先花力气在？",o:[["Te","目标、分工、时间表"],["Ti","把概念讲清楚，每个说法前后对得上"],["Fe","读的人能不能共鸣、愿意配合"],["Fi","写进去的是不是我真心相信的东西"]]},
{id:"j4",g:"f",st:1,s:"身边的人把一团乱的事摊到你面前，你自然会？",o:[["Te","帮他把目标和接下来的步骤理出来，好让事情继续走"],["Ti","帮他拆清楚问题到底出在哪"],["Fe","先陪着，把情绪接住"],["Fi","在心里想「换我会是什么感受」"]]},
{id:"j5",g:"f",s:"遇到一条你觉得不合理的规则？",o:[["Te","它没效率，就推动去改"],["Ti","它自己前后矛盾，我心里就不认"],["Fe","大家都被它弄得难受，就该改"],["Fi","它违背我的原则，我就不配合"]]},
{id:"j6",g:"f",s:"评价一个作品好不好，你看？",o:[["Te","它有没有达到目的，反响怎样"],["Ti","结构巧不巧，前后讲不讲得通"],["Fe","它打动了多少人"],["Fi","它是不是真诚"]]},
{id:"j7",g:"f",st:1,s:"跟人吵起来时，你更像？",o:[["Te","就事论事，要一个解决方案"],["Ti","纠正对方的用词和逻辑"],["Fe","察觉对方情绪，调整说法"],["Fi","守住底线，不在乎能不能说服他"]]},
{id:"j8",g:"f",s:"被要求做一件你不想做的事？",o:[["Te","看期限和标准，该做就先把事情推进"],["Ti","先搞懂为什么要做"],["Fe","看拒绝会伤到谁"],["Fi","不想就是不想"]]},
{id:"j9",g:"f",s:"挑工作时，最能打动你的是？",o:[["Te","职责清楚，能把事做成，结果可以衡量"],["Ti","能自由钻研有意思的问题"],["Fe","团队氛围好，被需要"],["Fi","跟我是谁对得上"]]},
{id:"j10",g:"f",st:1,s:"要张罗一件需要好几个人一起完成的事，你会？",o:[["Te","定下时间节点，把分工和进度排好"],["Ti","懒得张罗，但会顺手优化方案"],["Fe","确保每个人都被照顾到"],["Fi","只叫真正想见的人"]]},
{id:"j11",g:"f",s:"你道歉的方式更像？",o:[["Te","直接给补救措施"],["Ti","说明我哪一步想错了"],["Fe","先表达我在乎对方的感受"],["Fi","只有我真觉得自己错才道歉"]]},
{id:"j12",g:"f",s:"刷到一则有争议的新闻？",o:[["Te","看有没有能落地的结论"],["Ti","先找各方论证的漏洞"],["Fe","看人群的情绪往哪边走"],["Fi","心里立刻有自己的道德立场"]]},
{id:"a1",g:"a",s:"手上有一个顺手的老办法，又冒出一个没试过的新点子？",o:[["Ne","忍不住想先试新点子"],["Si","先把老办法做熟、做稳"]]},
{id:"a2",g:"a",s:"回想一段往事时，你的脑子是？",o:[["Ne","顺着它跳到一堆不相关的联想"],["Si","把当时的情形按原样回想清楚，好当作下次的参照"]]},
{id:"a3",g:"a",s:"吃一顿很好吃的饭时，你更常是？",o:[["Se","注意力都在此刻的口感、温度和周围的动静上"],["Ni","吃着吃着已经想到这顿饭之外的事，或它指向什么"]]},
{id:"a4",g:"a",s:"一件事进行到一半时，你更常盯着？",o:[["Ni","心里已经大概知道这事最后会怎么收尾，只是说不太清依据"],["Se","眼前实际正在发生什么，先不急着想它会通向哪"]]},
{id:"a5",g:"a",st:1,s:"小组讨论里，你更在乎？",o:[["Ti","先把每个词什么意思、彼此什么关系说清楚，好不好用、气氛怎样先不管"],["Fe","先让在场的人都跟得上、聊得舒服，说得精不精确可以晚点再补"]]},
{id:"a6",g:"a",s:"什么能让你改变看法？",o:[["Ti","别人觉得有没有用不算数，我自己从头想通了才会改"],["Fe","看到身边大多数人都认同，或者改了大家相处得更好"]]},
{id:"a7",g:"a",s:"决定一件事做不做，你先看？",o:[["Te","外部的标准、效果和代价"],["Fi","我心里认不认"]]},
{id:"a8",g:"a",s:"冲突僵住时，你更会？",o:[["Te","推进到一个能执行的解决办法"],["Fi","退回来守住自己的感受和立场"]]},
{id:"d1",g:"d",s:"哪个更像你平时的状态？",o:[["Pe","被外面正在发生的新东西拉着走"],["Pi","在心里反复琢磨已经见过、知道的东西"]]},
{id:"d2",g:"d",s:"信息量突然变大时？",o:[["Pe","越多越来劲"],["Pi","想先关掉，沉淀一下"]]},
{id:"d3",g:"d",s:"判断一件事对不对，你更依靠？",o:[["Je","外面公认的标准和实际结果"],["Ji","我自己心里那把尺子"]]},
{id:"d4",g:"d",s:"有了结论之后？",o:[["Je","把决定说出来，推动事情按这个走"],["Ji","先在心里定好，不一定说出来"]]},
{id:"d5",g:"d",s:"开始一件新事时？",o:[["Pd","先看看、摸一摸，再决定"],["Jd","先定方向，再去收集需要的信息"]]},
{id:"d6",g:"d",st:1,s:"朋友更常怎么形容你？",o:[["Pd","随性、反应快、点子多或者手感好"],["Jd","有主见、拍板快、立场清楚"]]},
{id:"x1",g:"x",s:"碰到一个新东西，你通常先？",o:[["Pe","先去碰、去看、去试，看它还能怎么玩"],["Ji","先在心里拿自己的尺子量一量，值不值得"]]},
{id:"x2",g:"x",s:"一天下来，你的精力更多花在？",o:[["Pe","接收外面的新信息、新刺激"],["Ji","在心里分析、衡量这些东西对不对"]]},
{id:"x3",g:"x",s:"别人更常觉得你是？",o:[["Pe","先动起来、边走边看的人"],["Ji","心里有一套自己标准的人"]]},
{id:"x4",g:"x",s:"一件事刚摆到你面前，你更常？",o:[["Pi","先在心里过一遍，弄明白大概怎么回事"],["Je","先把事情安排、推进起来"]]},
{id:"x5",g:"x",st:1,s:"一起商量一件事时，你更像？",o:[["Pi","在想这件事的来龙去脉和走向"],["Je","在把大家说的定成一个能马上动手的办法"]]},
{id:"x6",g:"x",s:"压力大时，你先？",o:[["Pi","先缩回自己心里，回想熟悉的事和感觉，让自己缓过来"],["Je","先把外面的事理顺，该定的定、该推的推"]]},
{id:"e1",g:"e",s:"一件很复杂的事结束后，你复盘是为了？",o:[["e5","弄清楚到底发生了什么"],["e8","看清局势，下一步把主动权拿回来"],["e1","检查自己有没有做到该有的标准"]]},
{id:"e2",g:"e",c:1,s:"有人越过你，替你做了本该你做的决定？",o:[["e8","不行，这是我的事，我要收回来"],["e9","算了，不值得起冲突，但心里记着"],["e6","先弄清他背后是谁、这样做会有什么后果"]]},
{id:"e3",g:"e",s:"一个人待了很久之后，你的感觉是？",o:[["e5","心里理清了，知道接下来该把力气放在哪件事上"],["e9","舒服，不被打扰最好"],["e4","沉在自己的感受里，觉得别人不太懂我"]]},
{id:"e4",g:"e",c:1,s:"被人当面批评时，心里第一个念头？",o:[["e1","我哪里没做到自己的标准"],["e8","先看他凭什么评判我；说得对我拿去用，说得不对，我不会让这话来定义我"],["e3","形象受损了，得想办法把表现扳回来"]]},
{id:"e5",g:"e",s:"帮朋友一个大忙之后，你心里？",o:[["e2","希望他记得我的好"],["e9","能帮就帮，不想他为难"],["e6","这样彼此更靠得住，以后有个照应"]]},
{id:"e6",g:"e",s:"一个新项目刚开局，你最先想的是？",o:[["e7","好多可能性，好兴奋"],["e3","怎么做出一个亮眼的成绩"],["e4","想做出一个有我自己味道、跟别人不一样的东西"]]},
{id:"e7",g:"e",c:1,s:"身边有人情绪很激烈时？",o:[["e4","我好像也被带进那种感受里"],["e2","想马上去照顾、安慰他"],["e9","太重了，我想躲开一点"]]},
{id:"e8",g:"e",s:"你提前看到了一个风险？",o:[["e9","先别慌，多半没那么严重，等等看"],["e5","先去找资料，把它彻底搞懂"],["e1","觉得「本来就不该这样」，想去纠正"]]},
{id:"e9",g:"e",s:"闲下来、有点无聊时？",o:[["e7","马上找新乐子"],["e4","觉得生活少了点意义"],["e5","钻进某个感兴趣的知识里"]]},
{id:"e10",g:"e",c:1,s:"争论到一半，你较劲的点是？",o:[["e2","不想把关系弄僵，想先把气氛缓下来"],["e1","错的就是错的，我得把它纠正过来"],["e3","不能显得不专业，不能被看扁"]]},
{id:"e11",g:"e",s:"一件事需要别人帮一把的时候，你通常？",o:[["e1","不想欠人情，能自己做好的就自己做好"],["e2","很难开口，宁可先去帮别人"],["e5","能不麻烦人就不麻烦，自己慢慢弄"],["e3","直接找最能帮上忙的人开口，把事办成要紧"]]},
{id:"e12",g:"e",c:1,s:"被一套规定框住时？",o:[["e7","憋得难受，想找个口子溜出去"],["e8","推回去，我的事我自己定"],["e9","表面配合，私下慢慢拖"]]},
{id:"e13",g:"e",s:"一件事搞砸之后？",o:[["e3","赶紧换条路，再证明一次"],["e4","觉得这说明我这个人本来就有问题"],["e7","往好处想，下一个会更好"]]},
{id:"e14",g:"e",s:"面对一个新上司或权威人物？",o:[["e6","先试探他靠不靠得住，出事了会不会护着我们"],["e8","先看他会不会插手我的事，我说了算的地方还在不在"],["e5","先看他到底懂不懂行，要不要花精力应付他"]]},
{id:"e15",g:"e",c:1,s:"群里发生了一件不公平的事？",o:[["e8","站出来，替吃亏的那方扛"],["e2","私下去安慰受委屈的人"],["e6","先看大家站哪边，再决定怎么表态"]]},
{id:"e16",g:"e",s:"被人真心夸了一句？",o:[["e3","爽，说明我做到了"],["e2","开心，说明我对别人有用"],["e4","怀疑他没看到真正的我"]]},
{id:"e17",g:"e",s:"一个完全空着的周末？",o:[["e7","排满好玩的"],["e6","先把下周可能出岔子的事准备好，心里踏实了再玩"],["e1","先把该做的事做完再说"]]},
{id:"e18",g:"e",s:"发现有人很依赖你？",o:[["e6","多了一份责任，得先确认自己担得住"],["e3","说明我能干，有面子"],["e7","有点累，想保留自己的自由"]]},
{id:"i1",g:"i",s:"进入一个新环境，你先搞清楚的是？",o:[["sp","吃住在哪、怎么待得舒服"],["so","谁说了算、大家怎么相处"],["sx","最吸引我的那个人或那件事"]]},
{id:"i2",g:"i",s:"多出一笔闲钱，你最想花在？",o:[["sp","存起来，或者改善生活的底子"],["so","圈子活动、人情往来"],["sx","让我特别着迷的人或东西"]]},
{id:"i3",g:"i",s:"心里有事放不下的时候，你脑子里转的是？",o:[["sp","生活乱了，得先睡好吃好找回掌控"],["so","我在别人眼里是什么位置"],["sx","某段关系、某个人，反复想"]]},
{id:"i4",g:"i",st:1,s:"在一场聚会上，你通常？",o:[["sp","找个舒服的地方，按需社交"],["so","在几个小圈子之间走动"],["sx","跟一个人聊得很深就够了"]]},
{id:"i5",g:"i",s:"一段关系里，你最怕？",o:[["sp","失去稳定和安全感"],["so","被排除在圈子之外"],["sx","变得平淡，没火花"]]},
{id:"i6",g:"i",s:"让你持续投入一件事的动力是？",o:[["sp","收入稳、条件好"],["so","被认可、有影响力"],["sx","有让我特别着迷、停不下来的人或事"]]},
{id:"i7",g:"i",s:"你的空虚感多半来自？",o:[["sp","生活节奏乱掉"],["so","跟群体断了联系"],["sx","缺一个强烈的连接"]]},
{id:"i8",g:"i",s:"上网时你最常在？",o:[["sp","收藏实用信息和攻略"],["so","跟圈子动态和热门话题"],["sx","追着某个人或某部作品挖到底"]]},
{id:"i9",g:"i",s:"压力很大时，你最想要？",o:[["sp","一个安全的地方躲起来恢复"],["so","找朋友聚一聚，回到群里"],["sx","一场让我整个人投进去、忘了时间的深谈或体验"]]}
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
["e5","e6","你更怕？","精力被用光、私人空间被闯进来","没有依靠、被丢下"],
["e5","e7","碰到一个新领域？","挑一个点钻到底","什么都尝一点"],
["e5","e7","一个人待久了？","心里理清了，知道接下来把力气放在哪","会闷，想出去找点事"],
["e3","e7","让你做下去的动力？","拿得出手的成果","过程本身好玩"],
["e3","e7","一件事黄了，最让你难受的是？","丢面子","扫兴、没意思了"],
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

const PAPER = "#F2E9D2", PAPER2 = "#ECE1C4", WASH = "#F4DEA6", INK = "#1D2A68", MUTED = "#5A6285", DIM = "#8C7A55", SUN = "#F6C23E", WARN = "#8B3A2A", TRACK = "#E3D6B3";
const HAIR = "rgba(29,42,104,0.22)";
const SERIF = 'Georgia, "Times New Roman", "Noto Serif SC", "Songti SC", "STSong", "SimSun", serif';
const SITE = "wr050429.github.io/renshe-typology-test";

type Fact = { label: string; value: string };
type ShareCard = { name: string; code: string; stack: string; note: string; axes: { label: string; value: number }[]; enn: Fact[]; ins: Fact[]; warns: string[]; footer: string; done: number; total: number; seed: number };

function hashStr(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  text.split("\n").forEach((para: string) => {
    if (!para) { lines.push(""); return; }
    const toks: string[] = para.match(/[\x21-\x7e]+|\s+|[^\s\x21-\x7e]/g) || [para];
    let line = "";
    toks.forEach((tk: string) => {
      const trial = line + tk;
      if (line && ctx.measureText(trial).width > maxW) { lines.push(line.replace(/\s+$/, "")); line = tk.replace(/^\s+/, ""); } else line = trial;
      while (line.length > 1 && ctx.measureText(line).width > maxW) { let k = line.length - 1; while (k > 1 && ctx.measureText(line.slice(0, k)).width > maxW) k--; lines.push(line.slice(0, k)); line = line.slice(k); }
    });
    if (line) lines.push(line);
  });
  return lines.length ? lines : [""];
}

function paintCard(ctx: CanvasRenderingContext2D, d: ShareCard, H: number, real: boolean): number {
  const W = 1080, pad = 96, maxW = W - pad * 2;
  const f = (size: number, italic?: boolean): void => { ctx.font = `${italic ? "italic " : ""}400 ${size}px ${SERIF}`; };
  const spaced = (t: string, x: number, yy: number, sp: number, align: string): void => {
    const chars = Array.from(t); let w = 0;
    chars.forEach((c: string) => { w += ctx.measureText(c).width; });
    w += sp * Math.max(0, chars.length - 1);
    let cx = align === "left" ? x : align === "right" ? x - w : x - w / 2;
    chars.forEach((c: string) => { ctx.fillText(c, cx, yy); cx += ctx.measureText(c).width + sp; });
  };
  const rule = (yy: number, lw: number): void => { ctx.fillStyle = INK; ctx.fillRect(pad, yy, maxW, lw); };
  const cen = (t: string, yy: number): void => { ctx.fillText(t, (W - ctx.measureText(t).width) / 2, yy); };
  const figHead = (x: number, w: number, yy: number, no: string, title: string, latin: string): void => {
    f(16); ctx.fillStyle = INK; spaced(`${no} · ${title}`, x, yy, 4, "left");
    f(17, true); ctx.fillStyle = DIM; ctx.fillText(latin, x + w - ctx.measureText(latin).width, yy);
  };
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  if (real) {
    ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
    const r = rng(d.seed);
    const n = Math.round((W * H) / 80);
    for (let i = 0; i < n; i++) {
      const a = 0.025 + r() * 0.07; const s = 0.6 + r() * 1.4;
      ctx.fillStyle = r() < 0.72 ? `rgba(140,122,85,${a.toFixed(3)})` : `rgba(29,42,104,${(a * 0.55).toFixed(3)})`;
      ctx.fillRect(r() * W, r() * H, s, s);
    }
    ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(40, 40, W - 80, H - 80);
    ctx.lineWidth = 0.8; ctx.strokeRect(50, 50, W - 100, H - 100);
  }
  let y = 84;
  f(16); ctx.fillStyle = INK; spaced("人设类型学合测 · 轴向版", pad, y, 5, "left"); spaced("PL. I", W - pad, y, 4, "right");
  y += 32; rule(y, 1.2);
  y += 14; f(17, true); ctx.fillStyle = DIM; ctx.fillText("Specimen personae · 八维 × 九型 × 本能", pad, y);
  const prog = `已答 ${d.done} / ${d.total}`; ctx.fillText(prog, W - pad - ctx.measureText(prog).width, y);
  y += 70;
  if (d.name) { f(36); ctx.fillStyle = MUTED; wrapText(ctx, d.name, maxW).forEach((l: string) => { cen(l, y); y += 48; }); y += 10; }
  const code = d.code || "· · · ·";
  let size = d.code ? (d.code.length <= 4 ? 190 : 118) : 120;
  f(size); while (size > 40 && ctx.measureText(code).width > maxW) { size -= 4; f(size); }
  ctx.fillStyle = d.code ? INK : DIM; cen(code, y); y += Math.round(size * 1.06);
  if (d.stack) { f(34, true); ctx.fillStyle = MUTED; wrapText(ctx, d.stack, maxW).forEach((l: string) => { cen(l, y); y += 46; }); }
  y += 8; f(19); ctx.fillStyle = DIM;
  wrapText(ctx, d.note, maxW - 120).forEach((l: string) => { spaced(l, W / 2, y, 3, "center"); y += 30; });
  y += 20; ctx.fillStyle = SUN; ctx.fillRect(W / 2 - 70, y, 140, 3); y += 46;
  rule(y, 1.2); rule(y + 5, 0.6); y += 38;
  figHead(pad, maxW, y, "FIG. I", "功能轴", "axes functionum"); y += 46;
  d.axes.forEach((a: { label: string; value: number }) => {
    f(26, true); ctx.fillStyle = INK; ctx.fillText(a.label, pad, y);
    const val = String(Math.round(a.value)); f(26); ctx.fillText(val, W - pad - ctx.measureText(val).width, y);
    const bx = pad + 140, bw = maxW - 140 - 76, by = y + 7, bh = 16;
    ctx.fillStyle = TRACK; ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = INK; ctx.fillRect(bx, by, bw * Math.max(0, Math.min(1, a.value / 100)), bh);
    ctx.strokeStyle = INK; ctx.lineWidth = 0.8; ctx.strokeRect(bx, by, bw, bh);
    ctx.fillStyle = "rgba(29,42,104,0.5)";
    [0.25, 0.5, 0.75].forEach((t: number) => { ctx.fillRect(bx + bw * t, by - 6, 1, 6); ctx.fillRect(bx + bw * t, by + bh, 1, 6); });
    y += 54;
  });
  y += 10; rule(y, 0.6); y += 36;
  const gap = 56, colW = (maxW - gap) / 2, y0 = y;
  const col = (x: number, yy: number, no: string, title: string, latin: string, items: Fact[]): number => {
    figHead(x, colW, yy, no, title, latin); yy += 48;
    items.forEach((it: Fact) => {
      f(15); ctx.fillStyle = DIM; spaced(it.label, x, yy, 3, "left"); yy += 24;
      f(28); ctx.fillStyle = INK; wrapText(ctx, it.value, colW).forEach((l: string) => { ctx.fillText(l, x, yy); yy += 38; });
      yy += 14;
    });
    return yy;
  };
  const yl = col(pad, y0, "FIG. II", "九型", "enneagramma", d.enn);
  const yr = col(pad + colW + gap, y0, "FIG. III", "本能", "instinctus", d.ins);
  ctx.fillStyle = "rgba(29,42,104,0.35)"; ctx.fillRect(pad + colW + gap / 2, y0, 0.8, Math.max(yl, yr) - y0 - 14);
  y = Math.max(yl, yr) + 6;
  if (d.warns.length) {
    rule(y, 0.6); y += 28;
    f(16); ctx.fillStyle = WARN; spaced("※ 提醒 · CAVEAT", pad, y, 4, "left"); y += 38;
    f(21);
    d.warns.forEach((w: string) => { ctx.fillText("—", pad, y); wrapText(ctx, w, maxW - 32).forEach((l: string) => { ctx.fillText(l, pad + 32, y); y += 32; }); y += 8; });
    y += 6;
  }
  y += 14; rule(y, 1.2); y += 20;
  f(17, true); ctx.fillStyle = DIM; ctx.fillText(d.footer, pad, y);
  const rt = "本图在本机生成，结果未上传"; f(16); ctx.fillText(rt, W - pad - ctx.measureText(rt).width, y);
  return y + 100;
}

function drawResultCard(d: ShareCard): HTMLCanvasElement {
  const scratch = document.createElement("canvas"); scratch.width = 1080; scratch.height = 200;
  const m = scratch.getContext("2d"); if (!m) throw new Error("canvas");
  const H = Math.ceil(paintCard(m, d, 0, false));
  const dpr = 2; const c = document.createElement("canvas"); c.width = 1080 * dpr; c.height = H * dpr;
  const ctx = c.getContext("2d"); if (!ctx) throw new Error("canvas");
  ctx.scale(dpr, dpr); paintCard(ctx, d, H, true);
  return c;
}

const opt = (sel: boolean): CSSProperties => ({ display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", whiteSpace: "normal", wordBreak: "break-word", padding: "10px 14px", marginTop: 8, borderRadius: 1, border: `1px solid ${sel ? INK : "rgba(29,42,104,0.34)"}`, boxShadow: sel ? `inset 3px 0 0 ${SUN}` : "none", background: sel ? WASH : "transparent", color: INK, fontFamily: SERIF, fontSize: 15.5, lineHeight: 1.6, cursor: "pointer" });
const chip = (sel: boolean): CSSProperties => ({ display: "inline-block", padding: "5px 10px", borderRadius: 0, border: `1px solid ${sel ? INK : HAIR}`, background: sel ? WASH : "transparent", color: sel ? INK : MUTED, fontFamily: SERIF, fontSize: 13, lineHeight: 1.45, textAlign: "left", whiteSpace: "normal", cursor: "pointer" });
const pbtn = (primary: boolean): CSSProperties => ({ padding: "9px 16px", borderRadius: 0, border: `1px solid ${INK}`, background: primary ? INK : "transparent", color: primary ? PAPER : INK, fontFamily: SERIF, fontSize: 14.5, letterSpacing: "0.08em", cursor: "pointer" });
const tag: CSSProperties = { fontSize: 12, letterSpacing: "0.22em", color: DIM };

const head = (no: string, title: string, latin: string, cap?: string) => (
  <div style={{ marginTop: 44 }}>
    <div style={{ borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${INK}`, height: 3 }} />
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "2px 16px", padding: "10px 0 4px" }}>
      <span style={tag}>{no}</span>
      <span style={{ fontStyle: "italic", fontSize: 13, color: DIM }}>{latin}</span>
    </div>
    <div style={{ fontSize: 26, lineHeight: 1.3, color: INK, letterSpacing: "0.04em" }}>{title}</div>
    {cap ? <div style={{ fontSize: 13, color: MUTED, marginTop: 4, lineHeight: 1.6 }}>{cap}</div> : null}
  </div>
);
const tbl = (cols: string[], rows: string[][], right: number) => (
  <div style={{ overflowX: "auto", marginTop: 14 }}>
    <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 14, color: INK, fontFamily: SERIF }}>
      <thead><tr>{cols.map((c: string, i: number) => <th key={i} style={{ textAlign: i >= right ? "right" : "left", padding: "6px 8px", fontWeight: 400, fontSize: 12, letterSpacing: "0.12em", color: DIM, borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${INK}`, whiteSpace: "nowrap" }}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((r: string[], j: number) => <tr key={j}>{r.map((c: string, i: number) => <td key={i} style={{ textAlign: i >= right ? "right" : "left", padding: "6px 8px", borderBottom: `1px solid ${j === rows.length - 1 ? INK : HAIR}`, fontVariantNumeric: "tabular-nums" }}>{c}</td>)}</tr>)}</tbody>
    </table>
  </div>
);
const bar = (label: string, v: number, key: string) => (
  <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${HAIR}` }}>
    <span style={{ width: 58, flex: "0 0 auto", fontStyle: "italic", fontSize: 16 }}>{label}</span>
    <div style={{ flex: "1 1 auto", minWidth: 0, position: "relative", height: 12, boxSizing: "border-box", background: TRACK, border: `1px solid ${INK}` }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(0, Math.min(100, v))}%`, background: INK }} />
      {[25, 50, 75].map((t: number) => <div key={t} style={{ position: "absolute", left: `${t}%`, top: -5, height: 4, width: 1, background: "rgba(29,42,104,0.5)" }} />)}
    </div>
    <span style={{ width: 34, flex: "0 0 auto", textAlign: "right", fontVariantNumeric: "tabular-nums", fontSize: 15 }}>{Math.round(v)}</span>
  </div>
);
const fact = (label: string, value: string) => (
  <div key={label} style={{ padding: "8px 0", borderBottom: `1px solid ${HAIR}` }}>
    <div style={{ fontSize: 11.5, letterSpacing: "0.2em", color: DIM }}>{label}</div>
    <div style={{ fontSize: 18, lineHeight: 1.45, marginTop: 2, wordBreak: "break-word" }}>{value}</div>
  </div>
);

type Shot = { url: string; blob: Blob };
type StepItem = { kind: "q"; q: Item; opts: { i: number; t: string }[] } | { kind: "p"; p: PItem; n: number };
const quiet: CSSProperties = { background: "transparent", border: "none", padding: 0, color: MUTED, fontFamily: SERIF, fontSize: 13.5, fontStyle: "italic", textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" };

export default function App() {
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1e9));
  const [ans, setAns] = useState<Ans>({});
  const [name, setName] = useState<string>("");
  const [shareFlash, setShareFlash] = useState<string>("");
  const [shot, setShot] = useState<Shot | null>(null);
  const order = useMemo(() => { const r = rng(seed); return shuffle(Q, r).map((q: Item) => ({ q, opts: shuffle(q.o.map((o: [string, string], i: number) => ({ i, t: o[1] })), r) })); }, [seed]);
  const R = useMemo(() => score(ans), [ans]);
  const poOrder = useMemo(() => { const r = rng(seed + 7); return shuffle(PO, r).map((p: PItem) => (r() < 0.5 ? { ...p, o: [p.o[1], p.o[0]] as [string, string][] } : p)); }, [seed]);
  const clearCard = (): void => { setShot((cur: Shot | null) => { if (cur) URL.revokeObjectURL(cur.url); return null; }); setShareFlash(""); };
  const setA = (id: string, v: number | string): void => { const n: Ans = { ...ans }; if (n[id] === v) delete n[id]; else n[id] = v; setAns(n); clearCard(); };
  const [stage, setStage] = useState<string>("cover");
  const [step, setStep] = useState<number>(0);
  const timer = useRef<number | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);
  const stopTimer = (): void => { if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; } };
  const reset = (): void => { stopTimer(); setAns({}); setSeed(Math.floor(Math.random() * 1e9)); setName(""); clearCard(); setStep(0); setStage("cover"); };

  // MBTI headline
  const top = R.ts[0], sec = R.ts[1];
  const fnDone = Q.filter((q: Item) => (q.g === "f" || q.g === "a") && typeof ans[q.id] === "number").length;
  const twin = R.ts.find((t: { s: string[] }) => t.s[0] === top.s[1] && t.s[1] === top.s[0]) || sec;
  const other = R.ts.slice(1).find((t: { t: string }) => t.t !== twin.t) || sec;
  const gapO = Math.round((top.v - other.v) * 10) / 10; const gapW = Math.round((top.v - twin.v) * 10) / 10;
  const locked = fnDone >= 20 && gapO >= 5 && gapW >= 3;
  const mbti = fnDone < 20 ? `八维题答了 ${fnDone}/32，先别看` : locked ? `${top.t}（${top.s.join("-")}）` : gapO >= 5 ? `${top.t} / ${twin.t} 待定（主辅先后没分开）` : `${top.t} / ${other.t} 待定`;
  const auxLow = fnDone >= 20 && R.f[top.s[1]] < 35;
  const alt = gapO >= 5 ? twin : other;
  const code = fnDone < 20 ? "" : locked ? top.t : `${top.t} / ${alt.t}`;
  const stack = fnDone < 20 ? "" : locked ? top.s.join(" – ") : `${top.s.join("–")}  /  ${alt.s.join("–")}`;
  const note = fnDone < 20 ? `八维题答了 ${fnDone}/32，先别看` : locked ? "已锁 · TYPUS FIXUS" : (gapO >= 5 ? "主辅先后还没分开，类型待定" : "与其他类型差距不足，类型待定");

  // Enneagram
  const eRank = EN.filter((k: string) => (R.ea[k] || 0) >= MIN_N).sort((x: string, y: string) => R.e[y] - R.e[x]);
  const nm = (k: string): string => k.slice(1);
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
    let k = s[0], alt2 = s[1], lock = R.e[s[0]] - R.e[s[1]] >= GAP;
    if (!lock && ready) { addPair(s[0], s[1]); const w = hw(s[0], s[1]); if (w !== 0) { lock = true; if (w < 0) { k = s[1]; alt2 = s[0]; } } }
    return { k, v: R.e[k], lock, alt: alt2 }; }).sort((x: { v: number }, y: { v: number }) => y.v - x.v);
  const tri = triParts.map((p: { k: string; lock: boolean; alt: string }) => p.lock ? nm(p.k) : `(${nm(p.k)}/${nm(p.alt)})`).join("");

  // Step sequence: all questions in shuffled order, then any playoff items currently needed
  const seq: StepItem[] = [
    ...order.map((row: { q: Item; opts: { i: number; t: string }[] }): StepItem => ({ kind: "q", q: row.q, opts: row.opts })),
    ...poOrder.filter((p: PItem) => needPairs.includes(pk2(p.a, p.b))).map((p: PItem, n: number): StepItem => ({ kind: "p", p, n })),
  ];
  const stepId = (s: StepItem): string => (s.kind === "q" ? s.q.id : s.p.id);
  const unanswered = seq.map((s: StepItem, i: number) => (ans[stepId(s)] === undefined ? i : -1)).filter((i: number) => i >= 0);
  const cur = Math.min(step, Math.max(0, seq.length - 1));
  useEffect(() => { if (stage === "q" && step >= seq.length) { setStage("result"); setStep(Math.max(0, seq.length - 1)); } }, [stage, step, seq.length]);
  useEffect(() => { const el = topRef.current; if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" }); }, [stage, step]);
  useEffect(() => () => stopTimer(), []);
  const go = (i: number): void => { stopTimer(); setStep(i); setStage("q"); };
  const next = (): void => { stopTimer(); setStep(cur + 1); };
  const prev = (): void => { stopTimer(); if (cur > 0) setStep(cur - 1); else setStage("cover"); };
  const pick = (id: string, v: number | string, adv: boolean): void => {
    const off = ans[id] === v; setA(id, v); stopTimer();
    if (!off && adv) { const from = cur; timer.current = window.setTimeout(() => { timer.current = null; setStep(from + 1); }, 260); }
  };

  // Instinct
  const iS = INS.slice().sort((x: string, y: string) => R.i[y] - R.i[x]);
  const iN = INS.reduce((s: number, k: string) => s + (R.is[k] || 0), 0);
  const iTxt = iN < 5 ? "本能题还不够" : `${iS[0]}${R.i[iS[0]] - R.i[iS[1]] >= GAP ? "" : "?"}/${iS[1]}${R.i[iS[1]] - R.i[iS[2]] >= GAP ? "" : "?"}`;

  // warnings
  const warn: string[] = [];
  const faNone = Q.filter((q: Item) => (q.g === "f" || q.g === "a" || q.g === "d" || q.g === "x") && ans[q.id] === "none").length;
  if (faNone >= 6) warn.push(`八维里有 ${faNone} 题选了「都不是」，有效样本变窄，类型结果请当草稿。`);
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

  const styleTxt = `更有意思 ${R.fun} 次 / 更舒服 ${R.comfy} 次`;
  const sketch = `【人设速写】\n八维：${mbti}${locked ? "" : "（差距不足 5 分，未锁）"}\n功能轴：Ne-Si ${R.ax.NeSi.toFixed(0)}｜Ni-Se ${R.ax.NiSe.toFixed(0)}｜Ti-Fe ${R.ax.TiFe.toFixed(0)}｜Te-Fi ${R.ax.TeFi.toFixed(0)}\n九型：${mainTxt}${wingTxt ? "，翼 " + wingTxt : ""}，三元 ${tri}\n本能：${iTxt}\n风格：${styleTxt}\n${warn.length ? "提醒：" + warn.join(" ") : "无污染提醒"}`;
  const axes = [{ label: "Ne–Si", value: R.ax.NeSi }, { label: "Ni–Se", value: R.ax.NiSe }, { label: "Ti–Fe", value: R.ax.TiFe }, { label: "Te–Fi", value: R.ax.TeFi }];
  const enn: Fact[] = [{ label: "主型", value: mainTxt }, { label: "翼型", value: wingTxt || "主型未锁，不判翼" }, { label: "三元", value: tri }];
  const ins: Fact[] = [{ label: "本能堆叠", value: iTxt }, { label: "风格题", value: styleTxt }];

  const sharePayload = (): ShareCard => ({ name: name.trim(), code, stack, note, axes, enn, ins, warns: warn.slice(), footer: SITE, done: R.done, total: Q.length, seed: hashStr(`${code}|${name.trim()}|${R.done}`) });
  const fileName = (): string => `人设合测-${name.trim() || (fnDone >= 20 ? top.t : "结果")}.png`;
  const generateCard = (): void => {
    if (R.done < 1) { setShareFlash("先答几题再生成"); return; }
    try {
      const drawn = drawResultCard(sharePayload());
      drawn.toBlob((blob: Blob | null) => {
        if (!blob) { setShareFlash("生成图片失败"); return; }
        const url = URL.createObjectURL(blob);
        setShot((cur: Shot | null) => { if (cur) URL.revokeObjectURL(cur.url); return { url, blob }; });
        setShareFlash("图已生成。下载不了时，长按或右键保存下面的图。");
      }, "image/png");
    } catch {
      setShareFlash("这个环境不能生成图片");
    }
  };
  const downloadCard = (): void => {
    if (!shot) return;
    try {
      const a = document.createElement("a");
      a.href = shot.url;
      a.download = fileName();
      a.click();
    } catch {
      setShareFlash("这个环境不能下载，请长按或右键保存下面的图");
    }
  };
  const shareImage = (): void => {
    if (!shot) return;
    const nav = navigator as unknown as { share?: (d: { files: File[]; title: string; text: string }) => Promise<void>; canShare?: (d: { files: File[] }) => boolean };
    const go = async (): Promise<void> => {
      try {
        const file = new File([shot.blob], fileName(), { type: "image/png" });
        if (nav.share && (!nav.canShare || nav.canShare({ files: [file] }))) {
          await nav.share({ files: [file], title: name.trim() ? `人设合测 · ${name.trim()}` : "人设类型学合测", text: sketch });
          return;
        }
      } catch (err: unknown) {
        const aborted = typeof err === "object" && err !== null && "name" in err && (err as { name: string }).name === "AbortError";
        if (aborted) return;
      }
      downloadCard();
    };
    void go();
  };

  const pct = Math.round((100 * R.done) / Q.length);
  const qText: CSSProperties = { color: INK, fontSize: 17, lineHeight: 1.6, marginTop: 4, wordBreak: "break-word" };
  const qBox: CSSProperties = { padding: "18px 0 16px", borderBottom: `1px solid ${HAIR}` };
  const romanN = (n: number): string => { const m: [number, string][] = [[50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; let s = ""; let v = n; m.forEach((p: [number, string]) => { while (v >= p[0]) { s += p[1]; v -= p[0]; } }); return s; };

  return (
    <Page title="人设类型学合测 · 轴向版" lang="zh-Hans" width="column" summary={`八维按功能轴和主导方向排栈，九型和本能按动机选最像的一项、按选中率计分。共 ${Q.length} 题，测完可生成一张结果分享图。`}>
      <div ref={topRef} style={{ background: PAPER, color: INK, fontFamily: SERIF, border: `1px solid ${INK}`, boxShadow: `inset 0 0 0 6px ${PAPER}, inset 0 0 0 7px rgba(29,42,104,0.45)`, padding: "26px clamp(16px, 5vw, 44px) 34px", maxWidth: 800, margin: "0 auto", boxSizing: "border-box", lineHeight: 1.6 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "4px 16px" }}>
          <span style={{ fontSize: 12.5, letterSpacing: "0.26em" }}>人设类型学合测 · 轴向版</span>
          <span style={{ fontSize: 12.5, letterSpacing: "0.18em" }}>{stage === "q" ? `第 ${cur + 1} / ${seq.length} 题 · 已答 ${R.done}/${Q.length}` : `已答 ${R.done}/${Q.length}`}</span>
        </div>
        <div style={{ marginTop: 8, height: 1, background: INK }} />
        <div style={{ height: 2, background: "rgba(29,42,104,0.08)" }}><div style={{ width: `${pct}%`, height: 2, background: SUN }} /></div>

        {stage === "cover" ? (
        <div>
        <div style={{ padding: "34px 0 6px" }}>
          <div style={tag}>TYPOLOGIA · EDITIO AXIALIS · Nº 01</div>
          <div style={{ fontSize: "clamp(40px, 9vw, 66px)", lineHeight: 1.08, marginTop: 14, letterSpacing: "0.02em" }}>人设类型学合测</div>
          <div style={{ fontSize: "clamp(22px, 4.6vw, 32px)", fontStyle: "italic", lineHeight: 1.25, color: MUTED, marginTop: 6 }}>Specimen personae, axibus ordinatum</div>
          <div style={{ marginTop: 18, paddingTop: 12, borderTop: `1px solid ${HAIR}`, fontSize: 15.5, color: INK }}>{`同一场景、几个方向正面竞争：八维按功能轴和主导方向排栈，九型和本能按动机选最像的一项、按选中率计分。共 ${Q.length} 题，每次重置都会打乱题目和选项顺序。测完后可以生成结果分享图。`}</div>
        </div>

        {head("§ I", "怎么答", "modus respondendi")}
        <div style={{ fontSize: 15.5, marginTop: 10 }}>选最像你平常、而不是理想中的那个。八维题如果两个方向都不是你平时的做法，选「都不是」比硬选更合适；这类题选多了，有效样本会变窄，类型结果请当草稿。九型和本能题另有「我不知道」（不计分）和「都不是」（每个选项各扣一点）。社交、团队、自由安排类的题多两个按钮：「我做更有意思那个」「我做更让我舒服那个」，不计入功能分。本能题选完「最像」后，还可以再点一个「最不像」，用来排第二、第三。</div>
        <div style={{ fontSize: 14.5, color: MUTED, marginTop: 10, fontStyle: "italic" }}>{`一次一题，共 ${Q.length} 题；普通题选中后自动翻到下一题，本能题选完「最像」「最不像」再翻页。随时可以回到上一题改答案，答完才出结果。`}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 18 }}>
          <button type="button" onClick={() => go(cur)} style={pbtn(true)}>{R.done === 0 ? "开始作答 →" : "继续作答 →"}</button>
          {R.done > 0 ? <button type="button" onClick={reset} style={pbtn(false)}>重置并重新打乱</button> : null}
          {R.done > 0 ? <button type="button" onClick={() => { stopTimer(); setStage("result"); }} style={quiet}>查看目前结果</button> : null}
        </div>
        </div>
        ) : null}

        {stage === "q" && seq.length > 0 ? (() => {
          const s = seq[cur];
          const id = stepId(s);
          const a = ans[id];
          const isI = s.kind === "q" && s.q.g === "i";
          const three = s.kind === "q" && (s.q.g === "e" || s.q.g === "i");
          const last = cur >= seq.length - 1;
          return (
            <div style={{ minHeight: 420 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "2px 12px", marginTop: 30 }}>
                <span style={{ fontStyle: "italic", fontSize: 16, color: DIM }}>{s.kind === "q" ? `No. ${cur + 1}` : `加赛 ${romanN(s.n + 1)}`}</span>
                <span style={tag}>{s.kind === "q" ? GL[s.q.g] : "九型 · 加赛"}</span>
              </div>
              {s.kind === "p" ? <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>只在分数差不到 15 时出现；只用来分胜负，不改选中率</div> : null}
              <div style={{ color: INK, fontSize: "clamp(20px, 4.4vw, 26px)", lineHeight: 1.5, marginTop: 12, wordBreak: "break-word" }}>{s.kind === "q" ? s.q.s : s.p.s}</div>
              {isI ? <div style={{ fontSize: 12, letterSpacing: "0.2em", color: DIM, marginTop: 14 }}>第一步 · 最像</div> : null}
              <div style={{ marginTop: isI ? 2 : 12 }}>
                {s.kind === "q"
                  ? s.opts.map((op: { i: number; t: string }, j: number) => (
                      <button type="button" key={op.i} onClick={() => pick(id, op.i, !isI)} style={opt(a === op.i)}><span style={{ fontStyle: "italic", color: DIM, marginRight: 8 }}>{`${"abcd"[j]}.`}</span>{op.t}</button>
                    ))
                  : s.p.o.map((o: [string, string], i: number) => (
                      <button type="button" key={i} onClick={() => pick(id, i, true)} style={opt(a === i)}><span style={{ fontStyle: "italic", color: DIM, marginRight: 8 }}>{`${"ab"[i]}.`}</span>{o[1]}</button>
                    ))}
              </div>
              {isI && s.kind === "q" && typeof a === "number" ? (
                <div style={{ marginTop: 16, padding: "12px 14px", border: `1px solid ${INK}`, background: PAPER2 }}>
                  <div style={{ fontSize: 12, letterSpacing: "0.2em", color: DIM }}>第二步 · 最不像（可选）</div>
                  <div style={{ fontSize: 13.5, color: MUTED, marginTop: 2 }}>本能题选完「最像」不会自动翻页。点一个最不像的，会直接进入下一题；不想选就点「下一题」。</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                    {s.opts.filter((op: { i: number; t: string }) => op.i !== a).map((op: { i: number; t: string }) => <button type="button" key={"l" + op.i} onClick={() => pick(id + "_l", op.i, true)} style={chip(ans[id + "_l"] === op.i)}>{`最不像：${op.t}`}</button>)}
                  </div>
                </div>
              ) : null}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {s.kind === "q" && s.q.st ? <button type="button" onClick={() => pick(id, "fun", true)} style={chip(a === "fun")}>我做更有意思那个</button> : null}
                {s.kind === "q" && s.q.st ? <button type="button" onClick={() => pick(id, "comfy", true)} style={chip(a === "comfy")}>我做更让我舒服那个</button> : null}
                {three ? <button type="button" onClick={() => pick(id, "idk", true)} style={chip(a === "idk")}>我不知道</button> : null}
                <button type="button" onClick={() => pick(id, "none", true)} style={chip(a === "none")}>{s.kind === "q" ? "都不是" : "都不像"}</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10, marginTop: 28, paddingTop: 14, borderTop: `1px solid ${HAIR}` }}>
                <button type="button" onClick={prev} style={pbtn(false)}>{cur === 0 ? "← 回到封面" : "← 上一题"}</button>
                <button type="button" onClick={next} style={pbtn(true)}>{last ? "完成，看结果" : "下一题 →"}</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", marginTop: 14, alignItems: "baseline" }}>
                {unanswered.length > 0 && unanswered[0] !== cur ? <button type="button" onClick={() => go(unanswered[0])} style={quiet}>{`跳到第一道未答题（还有 ${unanswered.length} 题）`}</button> : null}
                {R.done > 0 ? <button type="button" onClick={() => { stopTimer(); setStage("result"); }} style={quiet}>查看目前结果</button> : null}
              </div>
            </div>
          );
        })() : null}

        {stage === "result" ? (
          <div>
        {unanswered.length > 0 ? (
          <div style={{ marginTop: 26, padding: "10px 14px", border: `1px solid ${WARN}`, color: WARN, fontSize: 14, display: "flex", flexWrap: "wrap", gap: "6px 14px", alignItems: "baseline" }}>
            <span style={{ flex: "1 1 220px", minWidth: 0 }}>{`还有 ${unanswered.length} 题没答，下面先按已答部分计分。`}</span>
            <button type="button" onClick={() => go(unanswered[0])} style={{ ...quiet, color: WARN }}>去答未答的题</button>
          </div>
        ) : null}
        {head("PL. I", "结果标本", "specimen")}
        <div style={{ marginTop: 16, border: `1px solid ${INK}`, padding: 5 }}>
          <div style={{ border: `1px solid rgba(29,42,104,0.45)`, padding: "18px clamp(14px, 4vw, 32px) 22px", background: PAPER }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", fontSize: 11.5, letterSpacing: "0.22em" }}>
              <span>人设类型学合测 · 轴向版</span><span>PL. I</span>
            </div>
            <div style={{ height: 1, background: INK, marginTop: 6 }} />
            {name.trim() ? <div style={{ textAlign: "center", fontSize: 21, color: MUTED, marginTop: 22, wordBreak: "break-word" }}>{name.trim()}</div> : null}
            <div style={{ textAlign: "center", fontSize: code.length > 4 ? "clamp(38px, 10vw, 68px)" : "clamp(60px, 16vw, 116px)", lineHeight: 1.05, letterSpacing: "0.03em", marginTop: name.trim() ? 6 : 26, color: code ? INK : DIM, wordBreak: "break-word" }}>{code || "· · · ·"}</div>
            {stack ? <div style={{ textAlign: "center", fontStyle: "italic", fontSize: 19, color: MUTED, marginTop: 6 }}>{stack}</div> : null}
            <div style={{ textAlign: "center", fontSize: 12, letterSpacing: "0.2em", color: DIM, marginTop: 8 }}>{note}</div>
            <div style={{ width: 96, height: 2, background: SUN, margin: "16px auto 0" }} />
            <div style={{ marginTop: 22, borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${INK}`, height: 3 }} />
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", marginTop: 14 }}>
              <span style={{ fontSize: 12, letterSpacing: "0.2em" }}>FIG. I · 功能轴</span><span style={{ fontStyle: "italic", fontSize: 13, color: DIM }}>axes functionum</span>
            </div>
            <div style={{ marginTop: 4 }}>{axes.map((x: { label: string; value: number }) => bar(x.label, x.value, x.label))}</div>
            <div style={{ fontSize: 13, color: MUTED, marginTop: 8, lineHeight: 1.6 }}>{`八维：${mbti}（领先其他类型 ${gapO} 分、领先内外向孪生 ${gapW} 分；${locked ? "已锁" : "要求 5 分和 3 分"}）`}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 28px", marginTop: 18 }}>
              <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", paddingBottom: 4, borderBottom: `1px solid ${INK}` }}>
                  <span style={{ fontSize: 12, letterSpacing: "0.2em" }}>FIG. II · 九型</span><span style={{ fontStyle: "italic", fontSize: 13, color: DIM }}>enneagramma</span>
                </div>
                {enn.map((x: Fact) => fact(x.label, x.value))}
              </div>
              <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", paddingBottom: 4, borderBottom: `1px solid ${INK}` }}>
                  <span style={{ fontSize: 12, letterSpacing: "0.2em" }}>FIG. III · 本能</span><span style={{ fontStyle: "italic", fontSize: 13, color: DIM }}>instinctus</span>
                </div>
                {ins.map((x: Fact) => fact(x.label, x.value))}
              </div>
            </div>
            {warn.length > 0 ? (
              <div style={{ marginTop: 20, borderTop: `1px solid ${WARN}`, paddingTop: 10, color: WARN }}>
                <div style={{ fontSize: 12, letterSpacing: "0.22em" }}>※ 污染提醒 · CAVEAT</div>
                {warn.map((w: string, i: number) => <div key={i} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.6, marginTop: 6 }}><span>—</span><span style={{ flex: 1, minWidth: 0, wordBreak: "break-word" }}>{w}</span></div>)}
              </div>
            ) : null}
            <div style={{ height: 1, background: INK, marginTop: 20 }} />
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", marginTop: 8, fontSize: 12.5, color: DIM }}>
              <span style={{ fontStyle: "italic" }}>{SITE}</span><span>结果只在本机计算，不上传</span>
            </div>
          </div>
        </div>

        {head("§ IV", "分享图", "imago communicanda", "结果不会存到网上。生成一张图后，可以下载或发给别人；想写角色名的话，会出现在图上。")}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginTop: 14 }}>
          <input value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} placeholder="角色名（可选）" aria-label="角色名" style={{ flex: "1 1 180px", minWidth: 0, padding: "8px 2px", border: "none", borderBottom: `1px solid ${INK}`, borderRadius: 0, background: "transparent", color: INK, fontFamily: SERIF, fontSize: 16, outline: "none" }} />
          <button type="button" onClick={generateCard} style={pbtn(true)}>生成分享图</button>
          {shot ? <button type="button" onClick={downloadCard} style={pbtn(false)}>下载图片</button> : null}
          {shot ? <button type="button" onClick={shareImage} style={pbtn(false)}>分享</button> : null}
        </div>
        {shareFlash ? <div style={{ color: shareFlash.startsWith("图已") ? MUTED : WARN, fontSize: 13, marginTop: 8, wordBreak: "break-word" }}>{shareFlash}</div> : null}
        {shot ? <img src={shot.url} alt="测试结果分享图" style={{ display: "block", width: "100%", height: "auto", marginTop: 14, border: `1px solid ${INK}` }} /> : null}

        {needPairs.length > 0 ? head("附录 ·", "九型加赛对局", "certamen decretorium", "加赛只用来分胜负，不改选中率") : null}
        {needPairs.length > 0 ? tbl(["对局", "比分", "胜方"], needPairs.map((k: string) => { const [a, b] = k.split("-"); const r = h2h(a, b); return [`${nm(a)} 对 ${nm(b)}`, `${r.x} : ${r.y}`, r.x === r.y ? "平" : `${nm(r.x > r.y ? a : b)} 号`]; }), 1) : null}

        {head("附录 A", "栈的候选", "stirpes candidatae", "栈分 = 主导 36% + 辅助 26% + 第三 8% + 劣势 2% + 主导所在轴 4% + 辅助所在轴 3% + 主导内外向（方向题）7% + 先感知还是先判断（方向题）2% + 先后题 12%；主导或辅助低于 15 的栈打 6 折")}
        {tbl(["类型", "栈", "栈分"], R.ts.slice(0, 5).map((t: { t: string; s: string[]; v: number }) => [t.t, t.s.join("-"), String(t.v)]), 2)}

        {head("附录 B", "八维选中率", "functiones octo")}
        <div style={{ marginTop: 8 }}>{FN.slice().sort((x: string, y: string) => R.f[y] - R.f[x]).map((k: string) => bar(k, R.f[k], k))}</div>
        {tbl(["功能轴", "轴分"], Object.keys(R.ax).map((k: string) => [AXN[k], R.ax[k].toFixed(0)]), 1)}

        {head("附录 C", "九型选中率", "enneagramma", "分 = 100 × (选中 − 0.25 × 都不是) ÷ 有效出现；有效出现 = 出现 − 不知道；有效出现少于 4 的型不排名")}
        {tbl(["型", "分", "选中", "都不是", "不知道", "出现"], EN.slice().sort((x: string, y: string) => R.e[y] - R.e[x]).map((k: string) => [`${nm(k)} 号`, String(R.e[k]), String(R.es[k] || 0), String(R.en[k] || 0), String(R.ek[k] || 0), String((R.ea[k] || 0) + (R.ek[k] || 0))]), 1)}

        {head("附录 D", "本能选中率", "instinctus")}
        {tbl(["本能", "分", "最像", "最不像", "都不是", "不知道", "出现"], iS.map((k: string) => [k, String(R.i[k]), String(R.is[k] || 0), String(R.il[k] || 0), String(R.inn[k] || 0), String(R.ik[k] || 0), String((R.ia[k] || 0) + (R.ik[k] || 0))]), 1)}

        {head("附录 E", "角色人设速写", "adumbratio", "可直接复制")}
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: SERIF, fontSize: 14.5, lineHeight: 1.7, color: INK, padding: "12px 14px", marginTop: 12, border: `1px solid ${INK}`, background: PAPER2, userSelect: "all" }}>{sketch}</div>

        {head("附录 F", "出题参考", "fontes")}
        <div style={{ marginTop: 8 }}>
          {[
            { title: "Sakinorva 认知功能测试（轴向算法）", site: "sakinorva.net", href: "https://sakinorva.net/functions" },
            { title: "IDRlabs 认知功能测试", site: "idrlabs.com", href: "https://www.idrlabs.com/cognitive-function/test.php" },
            { title: "Sakinorva 与 Keys2Cognition 的效度对比", site: "typologytriad.wordpress.com", href: "https://typologytriad.wordpress.com/2020/06/16/tcf-series-part-2-evaluating-sakinorva-and-keys2cognition-test/" },
            { title: "RHETI：成对强迫选择", site: "enneagraminstitute.com", href: "https://www.enneagraminstitute.com/rheti/" },
            { title: "IVQ：三选一本能问卷", site: "enneagraminstitute.com", href: "https://www.enneagraminstitute.com/ivq/" },
          ].map((l: { title: string; site: string; href: string }, i: number) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer" style={{ display: "flex", flexWrap: "wrap", gap: "2px 12px", alignItems: "baseline", padding: "9px 0", borderBottom: `1px solid ${HAIR}`, color: INK, textDecoration: "none" }}>
              <span style={{ fontStyle: "italic", color: DIM, fontSize: 14 }}>{`${i + 1}.`}</span>
              <span style={{ flex: "1 1 200px", minWidth: 0, fontSize: 15, borderBottom: `1px solid rgba(29,42,104,0.35)` }}>{l.title}</span>
              <span style={{ fontStyle: "italic", color: DIM, fontSize: 13 }}>{l.site}</span>
            </a>
          ))}
        </div>

          <div style={{ marginTop: 36, paddingTop: 14, borderTop: `1px solid ${HAIR}`, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <button type="button" onClick={() => go(cur)} style={pbtn(false)}>← 回到题目</button>
            {unanswered.length > 0 ? <button type="button" onClick={() => go(unanswered[0])} style={pbtn(false)}>{`去答未答的 ${unanswered.length} 题`}</button> : null}
            <button type="button" onClick={reset} style={pbtn(false)}>重置并重新打乱</button>
          </div>
          </div>
        ) : null}

        <div style={{ marginTop: 40, borderTop: `1px solid ${INK}`, borderBottom: `1px solid ${INK}`, height: 3 }} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "2px 12px", marginTop: 10, fontSize: 12, letterSpacing: "0.16em", color: DIM }}>
          <span>{SITE}</span><span>不保存 · 不上传</span>
        </div>
      </div>
    </Page>
  );
}
