// 题库、计分与结果归纳。页面渲染仍在 app.tsx。
export type Item = { id: string; g: string; s: string; o: [string, string][]; st?: number; c?: number };
export type Ans = Record<string, number | string>;
export type PItem = { id: string; a: string; b: string; s: string; o: [string, string][] };
export type Fact = { label: string; value: string };
export type Mode = "all" | "eight" | "ennea" | "instinct";

export const Q: Item[] = [
{id:"p1",g:"f",s:"到一座陌生城市的第一天，你最自然在做什么？",o:[["Ne","脑子里冒出一堆「这里还能干嘛」，想多拐几条没去过的街"],["Ni","逛几个小时，心里就冒出一句话，能说清这座城是什么样"],["Se","先被街上的气味、声音、人流吸过去，看到想吃想玩的马上就去"],["Si","注意到很多具体的东西：物价、路牌、天气冷热，心里拿住惯的地方一项项对照"]]},
{id:"p2",g:"f",s:"你觉得一件事不对劲的时候，那个「不对劲」最先是怎么来的？",o:[["Ne","同时冒出好几种可能的解释，想一个个去验证"],["Ni","没什么证据，但已经有一个指向结局的预感"],["Se","当场就感觉到气氛变了，人一下子警觉起来，马上看向那边"],["Si","某个细节跟平时不一样：他今天的语气、东西摆的位置、自己身上哪里不对劲"]]},
{id:"p3",g:"f",s:"看完一本书或一部片，最后留在你身上的是？",o:[["Ne","它让我联想到的别的点子，越想越远"],["Ni","背后那条主线，作者真正想说的那一句"],["Se","画面、声音、节奏打在身上的那种冲击"],["Si","一些具体细节：某句台词、某个场景的样子，过很久还记得清清楚楚"]]},
{id:"p4",g:"f",s:"原定的计划突然被打乱，你第一反应是？",o:[["Ne","有点兴奋，新变量等于新玩法"],["Ni","心里对事情最后会怎样的那个感觉没变，换条路也不慌"],["Se","当场看眼下冒出了什么机会，抓住就动"],["Si","先看具体哪几处变了，其余的尽量照原来习惯的样子走"]]},
{id:"p5",g:"f",s:"学一样新技能，你通常怎么学？",o:[["Ne","东试西试，跳着学，边玩边找规律"],["Ni","先抓住核心原理，想一通百通"],["Se","直接上手，靠手感和即时反馈调整"],["Si","按步骤一遍遍练，记住每一步做对时是什么样、什么感觉，练到稳为止"]]},
{id:"p6",g:"f",st:1,s:"和朋友闲聊时，你嘴里最常冒出来的是？",o:[["Ne","「说到这个我想到……」然后话题拐走了"],["Ni","「我感觉这事最后会变成……」"],["Se","拿眼前看到、听到的东西当场开玩笑"],["Si","「上次我也碰到过，当时是……」连细节都说得出来"]]},
{id:"p7",g:"f",s:"想到「以后」，你脑子里是什么样？",o:[["Ne","一堆分岔路，每条都想去看看"],["Ni","说不出细节，但心里大概知道最后会走到哪一步"],["Se","不太往那儿想，眼前正在发生的事和冒出来的机会更吸引我"],["Si","希望日子跟现在差不多稳：作息、住的地方、身边的人别大变"]]},
{id:"p8",g:"f",s:"收拾桌面或房间时，你通常是？",o:[["Ne","收着收着翻到旧东西，开始想别的"],["Ni","只留真正要的，其他都无所谓"],["Se","平时随手放，哪天看着不顺眼了，一口气全收完"],["Si","每样东西都有固定位置，谁动过我一眼就看得出来"]]},
{id:"p9",g:"f",s:"你一般怎么发现自己累了？",o:[["Ne","注意力散成碎片、开始乱跳的时候"],["Ni","很晚才意识到，脑子还在推演别的"],["Se","手上、身上还在忙着玩着，一停下来才一下子垮掉"],["Si","身体先给信号：肩膀发紧、胃口变了，跟平时状态不一样就知道了"]]},
{id:"p10",g:"f",st:1,s:"第一次见一个人，你最先抓到的是？",o:[["Ne","他身上的反差和各种可能性"],["Ni","一个「这人是怎样的」直觉判断"],["Se","他整个人当下带来的冲击：气场强不强、声音大不大、一进门有没有存在感"],["Si","他的穿着打扮、说话用词、举止小细节，心里默默跟平常见惯的人比"]]},
{id:"p11",g:"f",st:1,s:"自由安排一次旅行，你会？",o:[["Ne","不做计划，路上看到有意思的就改道"],["Ni","为了一个特别想看的核心体验去"],["Se","吃好吃的、玩刺激的，感官要满足"],["Si","回喜欢过的地方，把记得的那家店、那条街再走一遍"]]},
{id:"p12",g:"f",s:"面对一个复杂问题，你的第一步通常是？",o:[["Ne","先发散，列出很多角度"],["Ni","先不急着动，等自己突然想通关键在哪"],["Se","先动手碰一下，看实际反应"],["Si","先把具体情况一条条看清，跟正常时候的样子对一对，看哪里不一样"]]},
{id:"j1",g:"f",st:1,s:"团队要拍板一件事，你最在意？",o:[["Te","能不能按时、有效地出结果"],["Ti","每一步道理我自己能不能想通，哪怕暂时用不上"],["Fe","大家能不能接受，气氛别崩"],["Fi","这件事跟我认同的东西对不对得上"]]},
{id:"j2",g:"f",s:"别人说你错了，你先做的是？",o:[["Te","拿数据和结果说话"],["Ti","在脑子里拆他的论证找漏洞"],["Fe","先看场面，别让谁下不来台"],["Fi","问自己心里是不是真觉得错了"]]},
{id:"j3",g:"f",s:"写一份方案，你最先花力气在？",o:[["Te","目标、分工、时间表"],["Ti","把概念讲清楚，每个说法前后对得上"],["Fe","读的人能不能共鸣、愿意配合"],["Fi","写进去的是不是我真心相信的东西"]]},
{id:"j4",g:"f",st:1,s:"身边的人把一团乱的事摊到你面前，你自然会？",o:[["Te","帮他把目标和接下来的步骤理出来，好让事情继续走"],["Ti","帮他拆清楚问题到底出在哪"],["Fe","先陪着，把情绪接住"],["Fi","在心里想「换我会是什么感受」"]]},
{id:"j5",g:"f",s:"遇到一条你觉得不合理的规则？",o:[["Te","它没效率，就推动去改"],["Ti","它自己前后矛盾，我心里就不认"],["Fe","大家都被它弄得难受，就该改"],["Fi","它跟我认定的做人底线过不去，我就不配合"]]},
{id:"j6",g:"f",s:"评价一个作品好不好，你看？",o:[["Te","它有没有达到目的，反响怎样"],["Ti","结构巧不巧，前后讲不讲得通"],["Fe","它打动了多少人"],["Fi","它是不是真诚"]]},
{id:"j7",g:"f",st:1,s:"跟人吵起来时，你更像？",o:[["Te","直接谈怎么解决，定个办法往下走"],["Ti","纠正对方的用词和逻辑"],["Fe","察觉对方情绪，调整说法"],["Fi","守住底线，不在乎能不能说服他"]]},
{id:"j8",g:"f",s:"被要求做一件你不想做的事？",o:[["Te","看期限和标准，该做就先把事情推进"],["Ti","先自己想通这事的道理，想不通就很难动手"],["Fe","看拒绝会伤到谁"],["Fi","不想就是不想"]]},
{id:"j9",g:"f",s:"挑工作时，最能打动你的是？",o:[["Te","职责清楚，能把事做成，结果可以衡量"],["Ti","能按自己的思路，把一个问题钻到彻底想明白"],["Fe","团队氛围好，被需要"],["Fi","跟我是谁对得上"]]},
{id:"j10",g:"f",st:1,s:"要张罗一件需要好几个人一起完成的事，你会？",o:[["Te","定下时间节点，把分工和进度排好"],["Ti","懒得张罗，但会顺手优化方案"],["Fe","确保每个人都被照顾到"],["Fi","只叫真正想见的人"]]},
{id:"j11",g:"f",s:"你道歉的方式更像？",o:[["Te","直接给补救措施"],["Ti","说明我哪一步想错了"],["Fe","先表达我在乎对方的感受"],["Fi","只有我真觉得自己错才道歉"]]},
{id:"j12",g:"f",s:"刷到一则有争议的新闻？",o:[["Te","看有没有能落地的结论"],["Ti","先找各方论证的漏洞"],["Fe","看人群的情绪往哪边走"],["Fi","心里立刻有自己的道德立场"]]},
{id:"a1",g:"a",s:"手上有一个顺手的老办法，又冒出一个没试过的新点子？",o:[["Ne","忍不住想先试新点子"],["Si","先把老办法做熟、做稳"]]},
{id:"a2",g:"a",s:"回想一段往事时，你的脑子是？",o:[["Ne","顺着它跳到一堆不相关的联想"],["Si","当时的情形一点点浮现：在哪、谁说了什么、身上什么感觉，都很清楚"]]},
{id:"a3",g:"a",s:"吃一顿很好吃的饭时，你更常是？",o:[["Se","注意力都在此刻的口感、温度和周围的动静上"],["Ni","吃着吃着已经想到这顿饭之外的事，或它指向什么"]]},
{id:"a4",g:"a",s:"一件事进行到一半时，你更常盯着？",o:[["Ni","心里已经大概知道这事最后会怎么收尾，只是说不太清依据"],["Se","眼前实际正在发生什么，先不急着想它会通向哪"]]},
{id:"a5",g:"a",st:1,s:"小组讨论里，你更在乎？",o:[["Ti","先把每个词什么意思、彼此什么关系说清楚，好不好用、气氛怎样先不管"],["Fe","先让在场的人都跟得上、聊得舒服，说得精不精确可以晚点再补"]]},
{id:"a6",g:"a",s:"什么能让你改变看法？",o:[["Ti","别人觉得有没有用不算数，我自己从头想通了才会改"],["Fe","看到身边大多数人都认同，或者改了大家相处得更好"]]},
{id:"a7",g:"a",s:"决定一件事做不做，你先看？",o:[["Te","外部的标准、效果和代价"],["Fi","这事我打心底想不想做、做了对不对得起自己"]]},
{id:"a8",g:"a",s:"冲突僵住时，你更会？",o:[["Te","推进到一个能执行的解决办法"],["Fi","退回来守住自己的感受和立场"]]},
{id:"a9",g:"a",s:"想让别人接受你的意见，得换个说法的时候，你更像？",o:[["Te","换成他听得进去的说法，他点头了就行，不再多绕"],["Ne","换着说法试来试去挺好玩，说着说着还会冒出新想法，聊到别处去"]]},
{id:"a10",g:"a",s:"一个办法行不通，要换别的办法时，你更像？",o:[["Ne","顺手想出好几种别的玩法，忍不住都想试试，哪怕已经有一个能用了"],["Te","换一个最快能把事办成的，成了就照这个做下去，不再折腾"]]},
{id:"a11",g:"a",s:"为了一个目标想办法的时候，你脑子里更常是？",o:[["Te","盯着目标，哪个办法最省事有效就用哪个，别的先不想"],["Ne","想着想着冒出一堆新可能，有时连目标都想换成一个更有意思的"]]},
{id:"d1",g:"d",s:"哪个更像你平时的状态？",o:[["Pe","注意力常被外面正在发生的新情况拉过去，跟着它走"],["Pi","更信自己心里已有的印象和经验，外面的新东西也先拿它对一对"]]},
{id:"d2",g:"d",s:"信息量突然变大时？",o:[["Pe","顺着外面的新信息一路看下去，越多越想看"],["Pi","先拿心里已有的印象当底，挑出跟它有关的，其余先放着"]]},
{id:"d3",g:"d",s:"判断一件事对不对，你更依靠？",o:[["Je","外面公认的标准和实际结果"],["Ji","我自己心里那把尺子"]]},
{id:"d4",g:"d",s:"有了结论之后？",o:[["Je","拿出去用、按它推进，看实际结果再调整"],["Ji","再用自己心里的标准过一遍，自己认了才算数"]]},
{id:"d5",g:"d",s:"开始一件新事时？",o:[["Pd","方向先空着，边看边碰，看到什么有意思再说"],["Jd","先定下要做成什么，要查的资料也照这个去找"]]},
{id:"d6",g:"d",st:1,s:"朋友更常怎么形容你？",o:[["Pd","随性、反应快、点子多或者手感好"],["Jd","有主见、拍板快、立场清楚"]]},
{id:"x1",g:"x",s:"碰到一个新东西，你通常先？",o:[["Pe","先去碰、去看、去试，看它还能怎么玩"],["Ji","先在心里拿自己的尺子量一量，值不值得"]]},
{id:"x2",g:"x",s:"一天下来，你的注意力更多放在？",o:[["Pe","接收外面的新信息、新刺激"],["Ji","在心里分析、衡量这些东西对不对"]]},
{id:"x3",g:"x",s:"别人更常觉得你是？",o:[["Pe","对新东西、新情况总是先接下来、先去看看的人"],["Ji","心里有自己一套是非好坏标准的人"]]},
{id:"x4",g:"x",s:"一件事刚摆到你面前，你更常？",o:[["Pi","先对照心里已有的印象：这事像什么、平常是怎样的"],["Je","先看要出什么结果，把事情安排、推进起来"]]},
{id:"x5",g:"x",st:1,s:"一起商量一件事时，你更像？",o:[["Pi","在拿自己心里对这事的印象去对照，看大家说的合不合"],["Je","在把大家说的定成一个能马上动手的办法"]]},
{id:"x6",g:"x",s:"压力大时，你先？",o:[["Pi","先抓住自己熟悉的习惯和心里的感觉，靠它稳住"],["Je","先把外面的事理顺，该定的定、该推的推"]]},
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
{id:"i9",g:"i",s:"压力很大时，你最想要？",o:[["sp","一个安全的地方躲起来恢复"],["so","找朋友聚一聚，回到群里"],["sx","一场让我整个人投进去、忘了时间的深谈或体验"]]},
{id:"e19",g:"e",s:"你觉得自己这一天过得值，多半是因为？",o:[["e1","事情按我认的标准做完了，心里踏实"],["e2","有人因为我而好过一点"],["e3","拿出了能看的成绩，没有丢脸"]]},
{id:"e20",g:"e",s:"你一个人坐着，脑子里更容易转的是？",o:[["e4","自己跟别人不太一样的那些地方"],["e5","某个还没想明白的问题"],["e6","接下来可能出岔子的事"]]},
{id:"e21",g:"e",s:"别人请你承诺一件会绑很久的事？",o:[["e7","会犹豫，怕把以后的路堵死"],["e8","先看这承诺会不会让我被捆住、听人指挥"],["e9","先答应再说，免得当场让人不高兴"]]},
{id:"e22",g:"e",s:"你回头看自己走过的路，最在意的是？",o:[["e1","有没有走偏、有没有对不起自己的标准"],["e4","这段路是不是真的像我，而不只是过得去"],["e7","有没有错过更活、更有新意的可能"]]},
{id:"e23",g:"e",s:"有人不断向你要时间、要精力？",o:[["e2","很难拒绝，怕他觉得我不在乎"],["e5","会心疼自己的存量，想先退回自己的空间"],["e8","直接划清：我的时间不是随便来拿的"]]},
{id:"e24",g:"e",s:"一个重要决定一直定不下来，最烦你的是？",o:[["e3","拖着看起来不像能办事的人"],["e6","信息不够，怕选错还要担责"],["e9","被催着表态，想再缓一缓"]]},
{id:"e25",g:"e",s:"发现自己可能错了？",o:[["e1","先对照原则，错了就得改过来"],["e5","先把整件事重新想清楚，再决定动不动"],["e9","先不想闹大，能悄悄收一收就收"]]},
{id:"e26",g:"e",s:"你对「依靠别人」这件事？",o:[["e2","我更习惯被人依靠，反过来会不太自在"],["e6","需要一个能信的人，同时又怕靠错"],["e7","不太想靠死一个人，免得没了选择"]]},
{id:"e27",g:"e",s:"你希望别人最后怎么记住你？",o:[["e3","这个人做成了事，是有分量的"],["e4","这个人是他自己，不是一张好看的皮"],["e8","这个人说了算，不会被随便拿捏"]]},
{id:"e28",g:"e",s:"你站出来反对一件事，多半是因为？",o:[["e1","它不对，不能就这么过去"],["e6","它可能把大家带进坑里，得先拦住"],["e8","它在削弱我或我在乎的人的主动权"]]},
{id:"e29",g:"e",s:"一段关系变淡了，你更难受的是？",o:[["e2","我好像变得可有可无，不再被需要"],["e4","那种独特的连接没了，好像没人再懂我"],["e9","平静被打破了，还得面对分离的麻烦"]]},
{id:"e30",g:"e",s:"你投入一件很难的事，撑下去是为了？",o:[["e3","做成了才证明我行"],["e5","不搞懂不甘心，也只有搞懂了才踏实"],["e7","过程里还有新东西可尝，停下来会闷"]]},
{id:"e31",g:"e",s:"夜里忽然醒来，你更容易被什么缠住？",o:[["e1","白天哪件事没做对，像一根刺"],["e6","某个还没着落的风险，越想越大"],["e9","其实想让自己别想了，可又懒得去处理"]]},
{id:"e32",g:"e",s:"你觉得生命里最不能少的是？",o:[["e2","有人需要我，我和别人互相撑着"],["e4","有一段配得上我的、深的感受"],["e7","前面还有可期待的事，不是一潭死水"]]},
{id:"e33",g:"e",s:"成功在望，但要你交出主导权？",o:[["e3","只要最后成绩还算我的，过程可以谈"],["e5","先想清楚自己还剩多少信息和余地，再决定要不要跟"],["e8","成绩可以不要，主导权不能交出去"]]},
{id:"e34",g:"e",s:"你给自己的生活定规矩，是为了？",o:[["e1","这样才不会偏离我认的对"],["e7","其实不太爱定死，定了也常想留个出口"],["e8","规矩得是我定的，用来护住我的边界"]]},
{id:"e35",g:"e",s:"你请人帮忙之前，心里先过一遍的是？",o:[["e2","会不会显得我只会索取，以后怎么还"],["e5","能不能自己搞定，别把私事先交出去"],["e6","这个人靠不靠得住，会不会把事情弄得更糟"]]},
{id:"e36",g:"e",s:"大家为小事吵起来时？",o:[["e3","觉得耽误正事，想把场面尽快拉回有效率的样子"],["e4","会觉得这种吵法很浅，真正的问题没人碰"],["e9","只想把声音降下来，让大家先过完这一天"]]},
{id:"i10",g:"i",s:"你选一个住的地方，最先卡住你的是？",o:[["sp","安静、便利、生活成本能不能长期撑住"],["so","周围是不是我能融入的人，会不会被晾在外面"],["sx","这里会不会让我和在乎的人、在乎的事靠得很近"]]},
{id:"i11",g:"i",s:"一天结束，你觉得今天没白过，是因为？",o:[["sp","身体和日子被安顿好了"],["so","我和某个圈子还连着，位置没有掉"],["sx","有一阵很浓的互动或投入，还留在身上"]]},
{id:"i12",g:"i",s:"你最不想被人打扰的是？",o:[["sp","我的作息、住处和过日子的节奏"],["so","我在群体里已经站稳的位置"],["sx","我和那个人或那件事之间的磁场"]]},
{id:"i13",g:"i",s:"资源突然变紧，你先保住什么？",o:[["sp","基本生活和后路"],["so","还得走动的关系和体面"],["sx","那件让我着迷、不肯放手的投入"]]},
{id:"i14",g:"i",s:"你更常因为什么拒绝一个邀请？",o:[["sp","会打乱我的休息或日常安排"],["so","我在那个场合里会很尴尬、站不住"],["sx","那晚没有我真正想靠近的人或事"]]},
{id:"i15",g:"i",s:"「家」对你来说，更接近？",o:[["sp","一个能歇、能储备、能按自己节奏过的地方"],["so","一群人里有我的位置，来了就属于这里"],["sx","有那个让我全身热起来的人在，才像家"]]},
{id:"i16",g:"i",s:"你回消息、回人的方式更像？",o:[["sp","按自己的精力和便利来，不让生活被打乱"],["so","会顾及群里的节奏和大家怎么看"],["sx","对上了就会回得很深、很快，没对上就懒得应付"]]},
{id:"i17",g:"i",s:"旅行或外出，你最先确认的是？",o:[["sp","吃住、路程和身体吃不吃得消"],["so","一起的人怎么分组、会不会玩不到一块"],["sx","有没有一段能认真靠近的时间或对象"]]},
{id:"i18",g:"i",s:"你最容易被掏空的是？",o:[["sp","生活一直不稳，连休息的地方都没有"],["so","长时间被晾在圈外，找不到自己的位置"],["sx","深的连接断了，或一直热不起来"]]},
];

export const PP: [string, string, string, string, string][] = [
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
["e3","e8","被你在乎的人看轻时，你更像？","最在意自己的本事没被看见，想拿出成绩让他改观","最在意他想压我一头，会直接顶回去，我的事轮不到他定"],
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
["e4","e5","被你在乎的人误解时，最刺你的是？","连他都没看懂真正的我，想让他知道我到底是怎样的","他没把事情弄清楚就下结论，我先退开，想清楚了再说"],
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
["e1","e8","规则和你的判断冲突时？","规则对就守，不对就该改规则","先按我的判断来，后果我自己担"],
["e1","e4","你更受不了自己变成？","一个做错还替自己找理由的人","一个看起来跟谁都一样的人"],
["e1","e4","做事时你更在意？","有没有偏离我认的正确","有没有失去我自己的味道"],
["e1","e4","反省的时候，你更盯着？","我哪里不够好、不够对","我是不是活得不像自己"],
["e1","e5","你改正一个问题，是为了？","它本来就不该错","我必须先把它真正搞懂"],
["e1","e5","面对一团乱时，你先？","按标准把该做的理顺","退开一点，把信息补齐再出手"],
["e1","e5","你对自己更严的是？","有没有守住原则","有没有把事情想明白"],
["e1","e7","你更怕日子变成？","随便、含糊、不讲究","重复、受限、没有新的可盼"],
["e1","e7","多了一条约束时？","约束对就该守","约束让我觉得被关起来"],
["e1","e7","休息对你来说？","把该做的做完才配休息","休息本身就是为了重新尝到活着"],
["e2","e5","别人靠近你时，你更像？","愿意被需要","先护住自己的空间"],
["e2","e5","你付出精力，更想换来？","对方记得我、还需要我","把问题搞懂，然后把精力收回来"],
["e2","e5","求助和被求助，你更像？","我更习惯去帮，被帮会过意不去","我更想自己解决，被缠上会累"],
["e2","e6","你接近一个人，先确认的是？","他是不是需要我","他靠不靠得住"],
["e2","e6","关系里的不安，更像？","我是不是不再被需要","我是不是站错边、没了后盾"],
["e2","e6","你给人帮忙，底色更像？","我想被需要、被记着","我想把关系织牢，以后有个照应"],
["e2","e7","别人的情绪把你缠住时？","我还是想留下来照顾","我想抽身去呼吸，别被拖进沉重里"],
["e2","e7","你更不想失去的是？","有人需要我的位置","我还能自由选择下一件开心的事"],
["e2","e7","安排时间时，你先看？","谁需要我","哪里还有新鲜和出口"],
["e2","e8","有人来占你的时间？","很难直接说不，怕伤到对方","我会明说：这事由我定，不是谁来要都可以"],
["e2","e8","你在一段关系里更想？","成为他需要的人","保持我说了算，不被情感捆住"],
["e2","e8","看见弱的一方，你更想？","上去照顾他","让他拿回自己的力量，而不是一直靠我"],
["e3","e6","你更怕别人怎么看你？","没做成、不行","不可靠、会连累别人或被丢下"],
["e3","e6","准备出场时你在忙？","把表现调到最好看","把可能的变数和退路想一遍"],
["e3","e6","一件事有风险也有曝光？","曝光值得冲","风险没着落就不想硬上"],
["e3","e9","你更想要的评价是？","这个人有成绩","这个人好相处、不惹事"],
["e3","e9","群体里起了波澜？","想办法让自己仍显得在状态","想把波澜按下去，大家都轻松点"],
["e3","e9","驱使你行动的，更像？","不想落后、不想看不见","不想被催、不想打破现有的安稳"],
["e4","e8","被否定时，你先护的是？","我这个人的独特性","我做主的权利"],
["e4","e8","你更不能忍？","被当成可替换的普通人","被当成可以随便指挥的人"],
["e4","e8","表达不满时，你更像？","把真实感受说出来，即使尖锐","直接设限，不让这事继续由别人定"],
["e4","e9","情绪来了？","我想待在里面，把它过完整","我想让它过去，好恢复平静"],
["e4","e9","你更怕关系变成？","表面和气，谁也不认识真正的我","为了说真话把大家的安宁搅碎"],
["e4","e9","面对彼此的差异？","差异证明我是我","差异能不提就不提，免得伤和气"],
["e5","e9","冲突要来时？","我先退到能想清楚的地方","我先把场面缓和，好继续安静过"],
["e5","e9","你需要空间，是为了？","保住精力和思考","保住没有波澜的日子"],
["e5","e9","别人叫你表态？","我还没想清楚，不想随便站队","表态容易引起争端，能含糊就含糊"],
];

export const PO: PItem[] = PP.map((p: [string, string, string, string, string], i: number) => ({ id: `po${i + 1}`, a: p[0], b: p[1], s: p[2], o: [[p[0], p[3]], [p[1], p[4]]] as [string, string][] }));
export const pk2 = (a: string, b: string): string => [a, b].sort().join("-");

export const FN = ["Ne", "Ni", "Se", "Si", "Te", "Ti", "Fe", "Fi"];
export const TYPES: Record<string, string[]> = { ENTP: ["Ne","Ti","Fe","Si"], ENFP: ["Ne","Fi","Te","Si"], INTP: ["Ti","Ne","Si","Fe"], ISTP: ["Ti","Se","Ni","Fe"], ESTP: ["Se","Ti","Fe","Ni"], ESFP: ["Se","Fi","Te","Ni"], INFP: ["Fi","Ne","Si","Te"], ISFP: ["Fi","Se","Ni","Te"], ENTJ: ["Te","Ni","Se","Fi"], ESTJ: ["Te","Si","Ne","Fi"], INTJ: ["Ni","Te","Fi","Se"], INFJ: ["Ni","Fe","Ti","Se"], ENFJ: ["Fe","Ni","Se","Ti"], ESFJ: ["Fe","Si","Ne","Ti"], ISTJ: ["Si","Te","Fi","Ne"], ISFJ: ["Si","Fe","Ti","Ne"] };
export const AXOF: Record<string, string> = { Ne: "NeSi", Si: "NeSi", Ni: "NiSe", Se: "NiSe", Ti: "TiFe", Fe: "TiFe", Te: "TeFi", Fi: "TeFi" };
export const AXN: Record<string, string> = { NeSi: "Ne-Si 轴", NiSe: "Ni-Se 轴", TiFe: "Ti-Fe 轴", TeFi: "Te-Fi 轴" };
export const EN = ["e1","e2","e3","e4","e5","e6","e7","e8","e9"];
export const INS = ["sp", "so", "sx"];
export const GL: Record<string, string> = { f: "八维", a: "八维·二选一", d: "八维·方向", x: "八维·先后", e: "九型", i: "本能" };


export function score(ans: Ans, mode: Mode = "all") {
  const allow = MODE_GROUPS[mode];
  const pk: Record<string, number> = {}; const ap: Record<string, number> = {};
  const att: Record<string, number> = { Pe: 0, Pi: 0, Je: 0, Ji: 0, Pd: 0, Jd: 0, xPe: 0, xPi: 0, xJe: 0, xJi: 0 };
  const isum: Record<string, number> = {}; const il: Record<string, number> = {};
  const er: Record<string, number> = {}; const em: Record<string, number> = {}; const ea: Record<string, number> = {}; const es: Record<string, number> = {};
  const ir: Record<string, number> = {}; const im: Record<string, number> = {}; const ia: Record<string, number> = {}; const is: Record<string, number> = {};
  let idk = 0, idkC = 0, fun = 0, comfy = 0, styE = 0, done = 0;
  for (const q of Q) {
    if (!allow.includes(q.g)) continue;
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

export type Score = ReturnType<typeof score>;

export const MIN_N = 4;
export const GAP = 15;
export const AGES = ["18 岁以下", "18–22", "23–29", "30 及以上"];

export const MODE_GROUPS: Record<Mode, string[]> = {
  all: ["f", "a", "d", "x", "e", "i"],
  eight: ["f", "a", "d", "x"],
  ennea: ["e"],
  instinct: ["i"],
};

export const MODE_META: Record<Mode, { title: string; short: string; heading: string; subtitle: string; filePrefix: string }> = {
  all: { title: "完整合测", short: "合测", heading: "人设类型学合测 · 轴向版", subtitle: "Specimen personae · 八维 × 九型 × 本能", filePrefix: "人设合测" },
  eight: { title: "单测八维", short: "八维", heading: "人设类型学 · 单测八维", subtitle: "Specimen personae · 八维", filePrefix: "人设单测八维" },
  ennea: { title: "单测九型", short: "九型", heading: "人设类型学 · 单测九型", subtitle: "Specimen personae · 九型", filePrefix: "人设单测九型" },
  instinct: { title: "单测本能", short: "本能", heading: "人设类型学 · 单测本能", subtitle: "Specimen personae · 本能", filePrefix: "人设单测本能" },
};

export const DISCLAIMER = "本页是人设与类型学讨论工具，不是临床诊断，也不是经过标准化的心理量表。分数只反映你这一次怎么选；详细解读是常见理论模型的整理，用来对照自观，不是对你性格的实证结论，更不能代替专业帮助。解读免费，也不上传答题。";

export function questionsFor(mode: Mode): Item[] {
  const allow = MODE_GROUPS[mode];
  return Q.filter((q: Item) => allow.includes(q.g));
}

export function includesPlayoffs(mode: Mode): boolean {
  return mode === "all" || mode === "ennea";
}

export function eUnlockThreshold(eTotal: number): number {
  return Math.min(eTotal, Math.max(15, Math.ceil(eTotal * 0.8)));
}

export function iUnlockThreshold(iTotal: number): number {
  return Math.min(iTotal, Math.max(5, Math.ceil(iTotal * 0.55)));
}

export function answersForMode(ans: Ans, mode: Mode): Ans {
  const allow = new Set<string>();
  questionsFor(mode).forEach((q: Item) => { allow.add(q.id); allow.add(q.id + "_l"); });
  if (includesPlayoffs(mode)) PO.forEach((p: PItem) => allow.add(p.id));
  const out: Ans = {};
  Object.keys(ans).forEach((k: string) => { if (allow.has(k)) out[k] = ans[k]; });
  return out;
}

export function optionKeysOf(id: string): string[] {
  const q = Q.find((x: Item) => x.id === id);
  return q ? q.o.map((o: [string, string]) => o[0]) : [];
}

export function playoffPairSet(): string[] {
  const s = new Set<string>();
  PO.forEach((p: PItem) => s.add(pk2(p.a, p.b)));
  return Array.from(s).sort();
}

export function playoffCountByPair(): Record<string, number> {
  const o: Record<string, number> = {};
  PO.forEach((p: PItem) => { const k = pk2(p.a, p.b); o[k] = (o[k] || 0) + 1; });
  return o;
}

export function expectedPlayoffPairs(): string[] {
  const out: string[] = [];
  for (let i = 1; i <= 9; i++) for (let j = i + 1; j <= 9; j++) out.push(pk2("e" + i, "e" + j));
  return out;
}

export function appearance(group: string, keys: string[]): Record<string, number> {
  const o: Record<string, number> = {};
  keys.forEach((k: string) => { o[k] = 0; });
  Q.filter((q: Item) => q.g === group).forEach((q: Item) => {
    q.o.forEach((x: [string, string]) => { if (o[x[0]] !== undefined) o[x[0]]++; else o[x[0]] = 1; });
  });
  return o;
}

export type TriPart = { k: string; v: number; lock: boolean; alt: string };

export type Presentation = {
  mode: Mode;
  R: Score;
  activeQ: Item[];
  total: number;
  done: number;
  unansweredMain: number;
  showEight: boolean;
  showEnnea: boolean;
  showInstinct: boolean;
  heading: string;
  subtitle: string;
  filePrefix: string;
  fnDone: number;
  fnTotal: number;
  top: { t: string; s: string[]; v: number };
  twin: { t: string; s: string[]; v: number };
  other: { t: string; s: string[]; v: number };
  locked: boolean;
  mbti: string;
  code: string;
  stack: string;
  note: string;
  gapO: number;
  gapW: number;
  auxLow: boolean;
  eRank: string[];
  eMain: string;
  viaPO: boolean;
  wingTxt: string;
  wingLocked: boolean;
  wingLeft: string;
  wingRight: string;
  tri: string;
  triParts: TriPart[];
  mainTxt: string;
  needPairs: string[];
  eDone: number;
  eTotal: number;
  eReadyAt: number;
  ready: boolean;
  cont: string[];
  iS: string[];
  iTxt: string;
  iN: number;
  iTotal: number;
  iReadyAt: number;
  iLocked: boolean;
  warn: string[];
  ageNote: string;
  styleTxt: string;
  sketch: string;
  axes: { label: string; value: number }[];
  enn: Fact[];
  ins: Fact[];
  age?: string;
};

export function h2hOf(ans: Ans, a: string, b: string): { x: number; y: number } {
  let x = 0, y = 0;
  PO.forEach((p: PItem) => {
    if (pk2(p.a, p.b) !== pk2(a, b)) return;
    const v = ans[p.id];
    if (typeof v !== "number") return;
    if (p.o[v][0] === a) x++; else y++;
  });
  return { x, y };
}

export function present(raw: Ans, mode: Mode, age: string = ""): Presentation {
  const ans = answersForMode(raw, mode);
  const meta = MODE_META[mode];
  const activeQ = questionsFor(mode);
  const R = score(ans, mode);
  const showEight = mode === "all" || mode === "eight";
  const showEnnea = mode === "all" || mode === "ennea";
  const showInstinct = mode === "all" || mode === "instinct";
  const unansweredMain = activeQ.filter((q: Item) => ans[q.id] === undefined).length;

  const top = R.ts[0], sec = R.ts[1];
  const fnDone = Q.filter((q: Item) => (q.g === "f" || q.g === "a") && typeof ans[q.id] === "number").length;
  const fnTotal = Q.filter((q: Item) => q.g === "f" || q.g === "a").length;
  const twin = R.ts.find((t: { s: string[] }) => t.s[0] === top.s[1] && t.s[1] === top.s[0]) || sec;
  const other = R.ts.slice(1).find((t: { t: string }) => t.t !== twin.t) || sec;
  const gapO = Math.round((top.v - other.v) * 10) / 10;
  const gapW = Math.round((top.v - twin.v) * 10) / 10;
  const locked = showEight && fnDone >= 20 && gapO >= 5 && gapW >= 3;
  const mbti = !showEight ? "" : fnDone < 20 ? `八维题答了 ${fnDone}/${fnTotal}，先别看` : locked ? `${top.t}（${top.s.join("-")}）` : gapO >= 5 ? `${top.t} / ${twin.t} 待定（主辅先后没分开）` : `${top.t} / ${other.t} 待定`;
  const auxLow = showEight && fnDone >= 20 && R.f[top.s[1]] < 35;
  const alt = gapO >= 5 ? twin : other;
  const code = !showEight ? "" : fnDone < 20 ? "" : locked ? top.t : `${top.t} / ${alt.t}`;
  const stack = !showEight ? "" : fnDone < 20 ? "" : locked ? top.s.join(" – ") : `${top.s.join("–")}  /  ${alt.s.join("–")}`;
  const note = !showEight ? "" : fnDone < 20 ? `八维题答了 ${fnDone}/${fnTotal}，先别看` : locked ? "已锁 · TYPUS FIXUS" : (gapO >= 5 ? "主辅先后还没分开，类型待定" : "与其他类型差距不足，类型待定");

  const nm = (k: string): string => k.slice(1);
  const eRank = EN.filter((k: string) => (R.ea[k] || 0) >= MIN_N).sort((x: string, y: string) => R.e[y] - R.e[x]);
  const h2h = (a: string, b: string): { x: number; y: number } => h2hOf(ans, a, b);
  const hw = (a: string, b: string): number => { const r = h2h(a, b); return r.x > r.y ? 1 : r.x < r.y ? -1 : 0; };
  const eDone = Q.filter((q: Item) => q.g === "e" && ans[q.id] !== undefined).length;
  const eTotal = Q.filter((q: Item) => q.g === "e").length;
  const eReadyAt = eUnlockThreshold(eTotal);
  const ready = showEnnea && eDone >= eReadyAt && eRank.length >= 2;
  const cont = ready ? eRank.filter((k: string) => R.e[eRank[0]] - R.e[k] < GAP).slice(0, 4) : [];
  const needPairs: string[] = [];
  const addPair = (a: string, b: string): boolean => { const k = pk2(a, b); if (!needPairs.includes(k) && PO.some((p: PItem) => pk2(p.a, p.b) === k)) needPairs.push(k); return true; };
  if (showEnnea && includesPlayoffs(mode)) {
    for (let i = 0; i < cont.length; i++) for (let j = i + 1; j < cont.length; j++) addPair(cont[i], cont[j]);
  }
  const cop: Record<string, number> = {};
  cont.forEach((k: string) => { cop[k] = 0; cont.forEach((o: string) => { if (o !== k) cop[k] += hw(k, o); }); });
  let eMain = ""; let viaPO = false;
  if (showEnnea && eRank.length >= 2 && R.e[eRank[0]] - R.e[eRank[1]] >= GAP) eMain = eRank[0];
  else if (showEnnea && cont.length >= 2) { const cs = cont.slice().sort((x: string, y: string) => cop[y] - cop[x]); if (cop[cs[0]] > cop[cs[1]]) { eMain = cs[0]; viaPO = true; } }
  const mainTxt = !showEnnea ? "" : eRank.length < 2 ? "九型题还不够" : eMain ? `${nm(eMain)} 号${viaPO ? "（加赛胜出）" : ""}` : cont.length >= 2 ? `${cont.map(nm).join(" / ")} 待定，做下方加赛` : `${nm(eRank[0])} 与 ${nm(eRank[1])} 待定（九型题答满 ${eReadyAt} 题后开加赛）`;
  const wr = (k: string, core: string): number => { let A = 0, S = 0, N = 0; Q.forEach((q: Item) => { if (q.g !== "e") return; const ks = q.o.map((o: [string, string]) => o[0]); if (!ks.includes(k) || ks.includes(core)) return; const v = ans[q.id]; if (v === undefined || v === "idk") return; A++; if (v === "none") N++; else if (typeof v === "number" && ks[v] === k) S++; }); return A ? Math.max(0, Math.round(100 * (S - 0.25 * N) / A)) : 0; };
  let wingTxt = "";
  let wingLocked = false;
  let wingLeft = "";
  let wingRight = "";
  if (showEnnea && eMain) {
    const n = +nm(eMain);
    const l = `e${n === 1 ? 9 : n - 1}`, r = `e${n === 9 ? 1 : n + 1}`;
    wingLeft = l; wingRight = r;
    const d = wr(l, eMain) - wr(r, eMain);
    if (Math.abs(d) >= GAP) { wingTxt = `${n}w${nm(d > 0 ? l : r)}`; wingLocked = true; }
    else if (ready && includesPlayoffs(mode) && addPair(l, r) && hw(l, r) !== 0) { wingTxt = `${n}w${nm(hw(l, r) > 0 ? l : r)}（加赛）`; wingLocked = true; }
    else wingTxt = `${n}w?（${nm(l)} 和 ${nm(r)} 差不到 ${GAP}，暂不判定翼型）`;
  }
  const centers = [["e8", "e9", "e1"], ["e2", "e3", "e4"], ["e5", "e6", "e7"]];
  const triParts: TriPart[] = showEnnea ? centers.map((c: string[]) => {
    const s = c.slice().sort((x: string, y: string) => R.e[y] - R.e[x]);
    if (eMain && c.includes(eMain)) return { k: eMain, v: 1000, lock: true, alt: eMain };
    let k = s[0], alt2 = s[1], lock = R.e[s[0]] - R.e[s[1]] >= GAP;
    if (!lock && ready && includesPlayoffs(mode)) { addPair(s[0], s[1]); const w = hw(s[0], s[1]); if (w !== 0) { lock = true; if (w < 0) { k = s[1]; alt2 = s[0]; } } }
    return { k, v: R.e[k] || 0, lock, alt: alt2 };
  }).sort((x: TriPart, y: TriPart) => y.v - x.v) : [];
  const tri = showEnnea ? triParts.map((p: TriPart) => p.lock ? nm(p.k) : `(${nm(p.k)}/${nm(p.alt)})`).join("") : "";

  const iS = INS.slice().sort((x: string, y: string) => R.i[y] - R.i[x]);
  const iN = INS.reduce((s: number, k: string) => s + (R.is[k] || 0), 0);
  const iTotal = Q.filter((q: Item) => q.g === "i").length;
  const iReadyAt = iUnlockThreshold(iTotal);
  const iLocked = showInstinct && iN >= iReadyAt && R.i[iS[0]] - R.i[iS[1]] >= GAP;
  const iTxt = !showInstinct ? "" : iN < iReadyAt ? "本能题还不够" : `${iS[0]}${R.i[iS[0]] - R.i[iS[1]] >= GAP ? "" : "?"}/${iS[1]}${R.i[iS[1]] - R.i[iS[2]] >= GAP ? "" : "?"}`;

  const warn: string[] = [];
  if (showEight) {
    const faNone = Q.filter((q: Item) => (q.g === "f" || q.g === "a" || q.g === "d" || q.g === "x") && ans[q.id] === "none").length;
    if (faNone >= 6) warn.push(`八维里有 ${faNone} 题选了「都不是」，有效样本变窄，类型结果请当草稿。`);
    if (auxLow) warn.push(`辅助功能 ${top.s[1]} 只有 ${R.f[top.s[1]]}，这个栈的第二位撑不住，类型先当草稿。`);
  }
  if (showEnnea) {
    if (R.e.e8 >= 50 && R.e.e5 >= 50 && Math.abs(R.e.e8 - R.e.e5) < GAP) warn.push("8 和 5 咬得很紧：看复盘、求助、权威那几题，你是为了「拿回主动」还是为了「先搞懂再说」。");
    if (R.e.e8 >= 70 && R.e.e9 >= 50) warn.push("8 高同时 9 也高：可能是 8 的「懒得为小事浪费力气」被记成了 9 的回避，去看冲突题。");
    if (R.idk >= 3 && R.idkC / R.idk >= 0.5) warn.push(`「我不知道」有 ${R.idkC}/${R.idk} 落在冲突题：留意 9（不想起冲突）和 6（先看后果再表态）。分数没动。`);
    if (R.e.e1 >= 50 && R.e.e3 >= 50 && Math.abs(R.e.e1 - R.e.e3) < GAP) warn.push("1 和 3 分不开：被批评时是在对照内心标准，还是在担心形象？");
  }
  if (showEight && showEnnea) {
    if (R.e.e4 >= 50 && R.f.Fe >= 50) warn.push("4 号和 Fe 同时高：被别人情绪带走可能是 Fe 的共振，不一定是 4 的身份感。");
    if (R.e.e6 >= 50 && R.f.Ni >= 50) warn.push("6 号和 Ni 同时高：预感风险可能来自 Ni 的收敛，不一定是 6 的不安全感。");
    if (R.e.e6 >= 50 && R.f.Si >= 50 && R.f.Ne >= 50) warn.push("6 号、Si、Ne 都高：压力下抠细节可能是劣势 Si，不等于 Si 主导。");
  }
  const styleShare = R.styE ? Math.round(100 * (R.fun + R.comfy) / R.styE) : 0;
  if (R.styE >= 4 && styleShare >= 50) warn.push(`社交/自由题里有 ${styleShare}% 选了「看情况」的风格项，这类场景你的答案不稳定。`);

  const young = age === AGES[0] || age === AGES[1];
  const domAuxGap = showEight && fnDone >= 20 ? Math.abs(R.f[top.s[0]] - R.f[top.s[1]]) : 0;
  const ageBits: string[] = [];
  if (young && showEight && fnDone >= 20 && domAuxGap < 15) ageBits.push(`你的主导 ${top.s[0]} 和辅助 ${top.s[1]} 只差 ${domAuxGap} 分`);
  if (young && showEight && fnDone >= 20 && gapW < 8) ageBits.push(`和主辅对调的 ${twin.t} 栈分只差 ${gapW}`);
  if (young && showEnnea && eMain && viaPO) ageBits.push("九型主型是靠加赛定出来的");
  const ageNote = !young ? "" : ageBits.length ? `这个年纪功能和动机常常还在成形。${ageBits.join("；")}，请把结果当作现在的样子，而不是定论。` : "这个年纪功能和动机常常还在成形，前两位分差小、九型靠加赛定出来的话，请当作现在的样子，而不是定论。";
  const styleTxt = `更有意思 ${R.fun} 次 / 更舒服 ${R.comfy} 次`;

  const sketchParts: string[] = ["【人设速写】"];
  if (showEight) {
    sketchParts.push(`八维：${mbti}${locked ? "" : "（差距不足 5 分，未锁）"}`);
    sketchParts.push(`功能轴：Ne-Si ${R.ax.NeSi.toFixed(0)}｜Ni-Se ${R.ax.NiSe.toFixed(0)}｜Ti-Fe ${R.ax.TiFe.toFixed(0)}｜Te-Fi ${R.ax.TeFi.toFixed(0)}`);
  }
  if (showEnnea) sketchParts.push(`九型：${mainTxt}${wingTxt ? "，翼 " + wingTxt : ""}，三元 ${tri}`);
  if (showInstinct) sketchParts.push(`本能：${iTxt}`);
  if (R.styE) sketchParts.push(`风格：${styleTxt}`);
  sketchParts.push(warn.length ? "提醒：" + warn.join(" ") : "无污染提醒");
  if (age) sketchParts.push(`年龄段：${age}`);
  if (ageNote) sketchParts.push(`年龄提示：${ageNote}`);
  const sketch = sketchParts.join("\n");

  const axes = showEight ? [{ label: "Ne–Si", value: R.ax.NeSi }, { label: "Ni–Se", value: R.ax.NiSe }, { label: "Ti–Fe", value: R.ax.TiFe }, { label: "Te–Fi", value: R.ax.TeFi }] : [];
  const enn: Fact[] = showEnnea ? [{ label: "主型", value: mainTxt }, { label: "翼型", value: wingTxt || "主型未锁，不判翼" }, { label: "三元", value: tri || "尚未归纳" }] : [];
  const ins: Fact[] = showInstinct ? [{ label: "本能堆叠", value: iTxt }, ...(R.styE ? [{ label: "风格题", value: styleTxt }] : []), ...(age ? [{ label: "年龄段", value: age }] : [])] : [...(!showInstinct && age ? [{ label: "年龄段", value: age }] : [])];

  // headline for non-eight modes
  let outCode = code, outStack = stack, outNote = note;
  if (!showEight && showEnnea) {
    outCode = eMain ? `${nm(eMain)} 号` : (cont.length ? cont.map(nm).join(" / ") : "");
    outStack = wingLocked ? wingTxt.replace("（加赛）", "") : (eMain ? "翼型暂不判定" : "主型未锁");
    outNote = eMain ? (viaPO ? "主型由加赛锁出 · 详见解读" : "主型已锁 · 详见解读") : "主型待定 · 不要把下面的理论档案当成已确认结果";
  } else if (!showEight && showInstinct) {
    outCode = iN >= iReadyAt ? iTxt.replace(/\?/g, "") : "";
    outStack = iTxt;
    outNote = iLocked ? "本能堆叠已锁 · 详见解读" : "本能堆叠待定 · 详见解读";
  }

  return {
    mode, R, activeQ, total: activeQ.length, done: R.done, unansweredMain,
    showEight, showEnnea, showInstinct,
    heading: meta.heading, subtitle: meta.subtitle, filePrefix: meta.filePrefix,
    fnDone, fnTotal, top, twin, other, locked, mbti, code: outCode, stack: outStack, note: outNote, gapO, gapW, auxLow,
    eRank, eMain, viaPO, wingTxt, wingLocked, wingLeft, wingRight, tri, triParts, mainTxt, needPairs,
    eDone, eTotal, eReadyAt, ready, cont,
    iS, iTxt, iN, iTotal, iReadyAt, iLocked,
    warn, ageNote, styleTxt, sketch, axes, enn, ins, age,
  };
}
