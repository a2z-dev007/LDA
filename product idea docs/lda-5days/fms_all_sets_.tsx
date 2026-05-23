import { useState } from "react";

const G = "#1D9E75", GL = "#E8F7F2", DK = "#1A2E2A", MD = "#4A7067", LT = "#8AADA6";

const DATA = {
  patient: {
    label: "Patient", emoji: "🕰", color: "#4A8FD4", bg: "#E6F1FB",
    sets: [
      {
        title: "Set A — What Tests It", theme: "Questions about what stretches patience — conflict, patterns, limits.",
        qs: [
          {
            stem: "The thing that tests my patience with my partner most is when they", end: "…",
            opts: [{ i: "🐢", t: "…need way more time to process something emotionally than I expect" }, { i: "🔁", t: "…repeat a pattern I thought we'd already worked through" }, { i: "📋", t: "…don't follow through on something they said they'd change" }, { i: "💭", t: "…seem unbothered by something that matters a lot to me" }],
            axis: "Axis B: Deep → slow to open up · Present → ready to resolve now", cc: "\"You want resolution. They need time. You're both right — the tension is the whole question.\""
          },
          {
            stem: "When I lose patience, the version of me that shows up is", end: "…",
            opts: [{ i: "🤐", t: "…quiet and withdrawn — I stop engaging" }, { i: "⚡", t: "…sharp — I say something I wish I could take back" }, { i: "🔄", t: "…relentless — I keep pushing until I get a response" }, { i: "🌊", t: "…resigned — I let the disappointment settle without saying it" }],
            axis: "Axis A: Expressive → sharp/relentless · Active → withdrawn/resigned", cc: "\"You go [quiet/sharp]. They go [relentless/quiet]. Your impatience has the same source — it just exits differently.\""
          },
          {
            stem: "The moment I know I've run out of patience is usually when", end: "…",
            opts: [{ i: "😬", t: "…I hear myself using a tone I hate" }, { i: "🎯", t: "…I stop caring about being kind in how I say it" }, { i: "💭", t: "…I start thinking 'what's even the point'" }, { i: "🔇", t: "…I go completely quiet when I usually wouldn't" }],
            axis: "Axis B: Deep → 'what's the point' · Present → tone/silence", cc: "\"You both have a tell. The moment you both name it is the moment it stops doing the damage.\""
          },
          {
            stem: "After I've lost patience and come back, the repair usually looks like", end: "…",
            opts: [{ i: "🙏", t: "…apologising for how I said it, even if not what I said" }, { i: "➡️", t: "…moving forward without naming what happened" }, { i: "❤️", t: "…one of us making a small gesture without words" }, { i: "💬", t: "…having the real conversation about what was underneath it" }],
            axis: "Axis A: Expressive → apology/conversation · Active → gesture/move forward", cc: "\"Your repair styles may not match. If one of you needs words and the other uses gestures — that gap is worth naming.\""
          },
          {
            stem: "The thing I silently wish my partner understood about my patience limits is", end: "…",
            opts: [{ i: "⏰", t: "…that getting there takes a lot — so hitting it means something real" }, { i: "🤫", t: "…I go quiet because I care too much, not because I stopped" }, { i: "🫀", t: "…that some days the patience is real work and I'd love them to know" }, { i: "😔", t: "…the days I seem fine are sometimes the hardest ones" }],
            axis: "Axis C: Protecting → 'care too much' · Building → 'real work'", cc: "\"You both hold more than you show. The reveal here is always one of the warmest.\""
          }
        ]
      },
      {
        title: "Set B — The Beauty of It", theme: "Questions about what patience has given the relationship — the gifts of staying.",
        qs: [
          {
            stem: "The most patient thing my partner has done for me is", end: "…",
            opts: [{ i: "⏳", t: "…given me time to come around without pushing" }, { i: "💬", t: "…waited for a conversation I kept avoiding" }, { i: "🌊", t: "…never made me feel rushed when I needed to process slowly" }, { i: "🌱", t: "…accepted a version of me I hadn't fully accepted myself" }],
            axis: "Axis B: Deep → accepted who I am · Present → gave time now", cc: "\"If they pick the same one: 'You both give each other the same kind of room. That's rare.'\""
          },
          {
            stem: "What patience in our relationship has made possible is", end: "…",
            opts: [{ i: "💬", t: "…conversations we couldn't have had in the first year" }, { i: "🏗️", t: "…a trust that comes from neither of us running when it got hard" }, { i: "🌿", t: "…a version of each other we helped build by staying" }, { i: "🌙", t: "…sitting in silence together without it feeling like distance" }],
            axis: "Axis B: Deep → built versions of each other · Present → comfortable silence", cc: "\"Your answer here is a summary of what this relationship has earned. Worth reading slowly.\""
          },
          {
            stem: "The quiet form of patience I practice that my partner might not notice is", end: "…",
            opts: [{ i: "🤫", t: "…swallowing small frustrations before they become big ones" }, { i: "🎧", t: "…being interested in things that don't naturally interest me" }, { i: "🗂️", t: "…not bringing up old things even when they'd win my argument" }, { i: "🌱", t: "…giving them credit for trying even when the trying is imperfect" }],
            axis: "Axis A: Expressive → credit for trying · Active → swallow frustrations", cc: "\"Your partner doesn't see this — yet. When they do, it's one of the most touching reveals in the set.\""
          },
          {
            stem: "If I could give our relationship a gift of patience, it would be", end: "…",
            opts: [{ i: "⏱️", t: "…more unhurried time — unscheduled, just for us" }, { i: "🌊", t: "…the ability to let small things go before they stack up" }, { i: "🧘", t: "…a longer fuse for both of us when outside stress is high" }, { i: "🌿", t: "…space to be works in progress without judgement" }],
            axis: "Axis C: Protecting → let small things go · Building → longer fuse", cc: "\"What you want to give them is also what you want. That's worth noticing.\""
          },
          {
            stem: "The thing patience has taught me about love is", end: "…",
            opts: [{ i: "⏳", t: "…timing is part of the message — right thing at the wrong time is still wrong" }, { i: "🌱", t: "…some things grow slowly and rushing them kills them" }, { i: "💙", t: "…the person who waits is often the one who loves most deeply" }, { i: "🤍", t: "…patience and acceptance are not the same — but they need each other" }],
            axis: "Axis B: Deep → slow growth · Present → timing matters now", cc: "\"This is the philosophical anchor of the set. Both answers side-by-side make a quiet, beautiful reveal.\""
          }
        ]
      },
      {
        title: "Set C — In Practice", theme: "Questions about the day-to-day mechanics of patience — how it's actually done.",
        qs: [
          {
            stem: "The way I stay patient when it's genuinely hard is", end: "…",
            opts: [{ i: "🚶", t: "…removing myself before I say something I'll regret" }, { i: "🌊", t: "…reminding myself this moment is not the whole relationship" }, { i: "🌟", t: "…finding one thing they did right recently and holding onto it" }, { i: "🧘", t: "…just breathing and choosing not to react" }],
            axis: "Axis A: Expressive → holding the good · Active → remove and reset", cc: "\"Your strategy is your personality. What you reach for when it's hard says something important.\""
          },
          {
            stem: "The difference between patience and just tolerating something is", end: "…",
            opts: [{ i: "💚", t: "…patience comes from love — tolerating comes from tiredness" }, { i: "🎯", t: "…patience still believes in the outcome — tolerating has stopped" }, { i: "⚡", t: "…patience is chosen — tolerating is what's left when you stop choosing" }, { i: "🤔", t: "…honestly, I'm not always sure — and that uncertainty bothers me a little" }],
            axis: "Axis B: Deep → 'still believes' · Present → 'chosen'", cc: "\"If they pick the last one too: 'You're both sitting with the same honest uncertainty. That's actually the healthiest answer here.'\""
          },
          {
            stem: "The kind of patience I struggle most to give my partner is", end: "…",
            opts: [{ i: "💔", t: "…when they're down on themselves and I can't fix it" }, { i: "🤐", t: "…when they're not meeting a need I have but naming it feels like pressure" }, { i: "🔁", t: "…when the same thing keeps happening despite both of us trying" }, { i: "🗝️", t: "…when I can see the solution and they need to find it themselves" }],
            axis: "Axis C: Building → repeating patterns · Protecting → can't fix their pain", cc: "\"What's hard for you to give is often what's hardest for them to ask for. This one opens conversations.\""
          },
          {
            stem: "When my partner is patient with me, it makes me feel", end: "…",
            opts: [{ i: "🌱", t: "…seen and accepted without the condition of being perfect" }, { i: "😶", t: "…slightly guilty that I don't always return it equally" }, { i: "🙏", t: "…grateful in a way that's hard to put into words" }, { i: "💙", t: "…loved in the most honest, unglamorous way love can feel" }],
            axis: "Axis A: Expressive → grateful/loved deeply · Active → guilty/seen", cc: "\"If they pick guilt and you pick gratitude — or vice versa — that's a conversation worth having.\""
          },
          {
            stem: "In ten years, the patience I'll be most proud of is probably", end: "…",
            opts: [{ i: "🌧️", t: "…the patience in the hardest weeks — not the easy ones" }, { i: "🧭", t: "…choosing to understand before choosing to react" }, { i: "👂", t: "…listening fully instead of preparing my response" }, { i: "🕯️", t: "…giving us time to find our way back instead of forcing resolution" }],
            axis: "Axis B: Deep → 'find our way back' · Present → 'listening in the moment'", cc: "\"This is the closing anchor. Both answers create a portrait of what this relationship has already done.\""
          }
        ]
      }
    ]
  },

  present: {
    label: "Present", emoji: "🌿", color: "#1D9E75", bg: "#E8F7F2",
    sets: [
      {
        title: "Set A — Phones & Distraction", theme: "Questions about the practical ways attention is lost — screens, busyness, mental absence.",
        qs: [
          {
            stem: "The way distraction most comes between us is", end: "…",
            opts: [{ i: "📱", t: "…phones at dinner — both of us half-checking" }, { i: "💭", t: "…being mentally somewhere else even when I'm physically there" }, { i: "🛏️", t: "…screens in bed — the last place I expected to lose" }, { i: "🗓️", t: "…always being partly in my head about the next thing on the list" }],
            axis: "Axis A: Expressive → mental absence · Active → screens/physical habits", cc: "\"You lose each other the same way or differently. Either answer makes the same point: something has been slowly eating the time.\""
          },
          {
            stem: "When I feel like I'm not getting their full attention, I usually", end: "…",
            opts: [{ i: "💬", t: "…ask for it directly — 'can you put that down for a minute'" }, { i: "🤫", t: "…get quieter and wait to see if they notice" }, { i: "😶", t: "…say 'never mind' and absorb the small hurt" }, { i: "📱", t: "…pick up my phone too, as a kind of defence" }],
            axis: "Axis A: Active → ask directly · Expressive → go quiet/absorb", cc: "\"One of you reaches. The other retreats. If you both go quiet — that's the pattern worth naming first.\""
          },
          {
            stem: "The version of us I want back most is the one before", end: "…",
            opts: [{ i: "📱", t: "…we each had a screen to retreat to in every quiet moment" }, { i: "🏃", t: "…busyness became default and presence became something we scheduled" }, { i: "🔋", t: "…every evening had somewhere else we were mentally supposed to be" }, { i: "📵", t: "…we stopped putting the phone face down on purpose" }],
            axis: "Axis C: Building → wants change · Protecting → wants what was", cc: "\"This is nostalgia with a direction. The answer points at exactly what to protect going forward.\""
          },
          {
            stem: "The thing I do to create presence that actually works is", end: "…",
            opts: [{ i: "🚫", t: "…leaving my phone in another room when we're eating" }, { i: "❓", t: "…asking them something specific that requires a real answer" }, { i: "🤝", t: "…making physical contact as a reset — a hand, an arm" }, { i: "💬", t: "…noticing when we're both in our heads and just saying so" }],
            axis: "Axis A: Active → physical gesture · Expressive → naming it aloud", cc: "\"What works for you may not be what works for them. If the answers differ — try each other's way.\""
          },
          {
            stem: "Full presence to me ultimately means", end: "…",
            opts: [{ i: "📵", t: "…phone down, eyes up, not half-somewhere else" }, { i: "💭", t: "…being interested — not just physically in the same room" }, { i: "❓", t: "…asking questions that need more than a one-word answer" }, { i: "👂", t: "…listening to what they felt, not just what they said" }],
            axis: "Axis A: Expressive → felt/questions · Active → eyes up/physical", cc: "\"Your definition of presence is your ask. Seeing each other's answer is a quiet way to say: 'This is what I need.'\""
          }
        ]
      },
      {
        title: "Set B — Emotional Presence", theme: "Questions about what it means to be truly there — emotionally, not just physically.",
        qs: [
          {
            stem: "Being emotionally present for my partner, at its hardest, means", end: "…",
            opts: [{ i: "👂", t: "…listening to something not about me without making it about me" }, { i: "🌊", t: "…sitting with their feelings without trying to change them" }, { i: "💭", t: "…being curious about their world even when mine is full" }, { i: "🤐", t: "…not giving advice when all they needed was to be heard" }],
            axis: "Axis B: Deep → curious about inner world · Present → being there in this moment", cc: "\"If they pick the same one: you both know what real presence asks of you. If different: you need different things. Both useful.\""
          },
          {
            stem: "The moment I realize I wasn't really present is usually", end: "…",
            opts: [{ i: "😶", t: "…when they said something important and I half-heard it" }, { i: "💬", t: "…when they say 'you didn't actually hear what I said'" }, { i: "🌊", t: "…when they go quiet in a way that tells me I missed something" }, { i: "🤔", t: "…when I realize I've been nodding without registering anything" }],
            axis: "Axis A: Active → they say it aloud · Expressive → notice the quiet shift", cc: "\"How you detect absence tells you how attuned you are. The quiet-noticing answers are often the most connected ones.\""
          },
          {
            stem: "The kind of presence I wish I gave more easily is", end: "…",
            opts: [{ i: "🌊", t: "…sitting with hard feelings without rushing to make them better" }, { i: "👁️", t: "…full eye contact — the kind that says 'I'm not going anywhere'" }, { i: "❓", t: "…asking the second question — the one after the obvious one" }, { i: "📋", t: "…remembering what they told me yesterday and asking about it today" }],
            axis: "Axis B: Deep → second question / memory · Present → eye contact / sitting with", cc: "\"What you wish you gave more easily is often exactly what your partner most needs. This is worth showing them.\""
          },
          {
            stem: "When my partner is fully present with me, it shows up as", end: "…",
            opts: [{ i: "💬", t: "…them remembering small things I mentioned in passing" }, { i: "👑", t: "…the feeling of being the most important thing in the room" }, { i: "❓", t: "…them asking the question that goes one layer deeper" }, { i: "👁️", t: "…being looked at in a way that doesn't need anything back" }],
            axis: "Axis A: Expressive → remembered/looked at · Active → important in room / deeper questions", cc: "\"This is your love language for presence. Seeing each other's answer is permission to give each other that thing.\""
          },
          {
            stem: "The thing that makes presence hard for me, honestly, is", end: "…",
            opts: [{ i: "💭", t: "…my head is often somewhere else even when I want it to be here" }, { i: "🏠", t: "…I carry the day home and it takes time to set it down" }, { i: "⚡", t: "…being present requires energy I don't always have left" }, { i: "🚪", t: "…sometimes I use busyness to avoid the depth" }],
            axis: "Axis C: Building → avoids depth · Protecting → carries the day home", cc: "\"The most honest question in this set. If both pick the last one — that's the conversation to have tonight.\""
          }
        ]
      },
      {
        title: "Set C — Quality Time", theme: "Questions about what being together actually looks like — what counts, what's missed.",
        qs: [
          {
            stem: "The kind of time together that makes me feel most connected is", end: "…",
            opts: [{ i: "🛋️", t: "…doing nothing — same room, no agenda, just us" }, { i: "🚶", t: "…doing something side by side — walking, cooking, a shared project" }, { i: "💬", t: "…a conversation where we both say something we haven't said before" }, { i: "🌙", t: "…the rare evening when we both put everything down at the same time" }],
            axis: "Axis A: Expressive → conversation/doing nothing · Active → side by side / put it all down", cc: "\"If one needs stillness and the other needs activity — you've just found why your 'together time' sometimes misses. Both right.\""
          },
          {
            stem: "The difference between being together and being present together is", end: "…",
            opts: [{ i: "📏", t: "…huge — and I think we've drifted toward together and away from present" }, { i: "💡", t: "…presence is when what's between us is the point, not just a backdrop" }, { i: "🎯", t: "…being together is physical — present is intentional" }, { i: "🫀", t: "…I know the difference immediately — and I miss it when it's gone" }],
            axis: "Axis B: Deep → 'miss it when gone' · Present → 'intentional'", cc: "\"There's no wrong answer here — but 'huge, we've drifted' plus 'I miss it' is the most important combination to notice.\""
          },
          {
            stem: "The time of day I feel most present with my partner is usually", end: "…",
            opts: [{ i: "☀️", t: "…mornings — before the day has claimed both of us" }, { i: "🌙", t: "…evenings after dinner if neither of us is too tired" }, { i: "🚗", t: "…in the car — something about movement and not facing each other" }, { i: "🛏️", t: "…in bed before sleep, when the filters come down a little" }],
            axis: "Axis B: Deep → filters down before sleep · Present → morning / car movement", cc: "\"This answer is a signal for when to have important conversations. If you both pick different times — try each other's.\""
          },
          {
            stem: "The small ritual we have that feels like genuine presence is", end: "…",
            opts: [{ i: "✨", t: "…one thing we do every day that is just ours" }, { i: "💬", t: "…checking in at the end of the day — even briefly" }, { i: "🛡️", t: "…an unspoken understanding that this time is protected" }, { i: "🤍", t: "…something we probably don't name but would both miss if it disappeared" }],
            axis: "Axis C: Protecting → protect the ritual · Building → create something new", cc: "\"If you both pick the last one — you have the same unnamed thing. Name it together tonight.\""
          },
          {
            stem: "If I could create one new habit of presence with my partner, it would be", end: "…",
            opts: [{ i: "📵", t: "…one phone-free hour every evening — non-negotiable" }, { i: "❓", t: "…asking 'how are you really?' instead of 'how was your day?'" }, { i: "📋", t: "…remembering and following up on things they said mattered" }, { i: "👁️", t: "…making real eye contact when they're talking — actually making it" }],
            axis: "Axis A: Active → phone-free / eye contact · Expressive → ask deeper / remember", cc: "\"This is an ask — and a gift. Show them this answer and ask if they'll do the same for you.\""
          }
        ]
      }
    ]
  },

  honest: {
    label: "Honest", emoji: "🔦", color: "#B07010", bg: "#FAEEDA",
    sets: [
      {
        title: "Set A — The Hard Truths", theme: "Questions about what the user finds difficult to say and why honesty is hard in this relationship.",
        qs: [
          {
            stem: "The thing I find hardest to be honest about with my partner is", end: "…",
            opts: [{ i: "🔊", t: "…when something they do regularly is quietly driving me mad" }, { i: "🫀", t: "…that I need more than I'm currently asking for" }, { i: "🌧️", t: "…when I'm not okay but it feels safer to say I am" }, { i: "💭", t: "…my doubts — because naming them feels like making them real" }],
            axis: "Axis B: Deep → doubts/needs · Present → not okay right now", cc: "\"Whatever they pick — this is what needs a safe space first. The answer is an invitation, not a warning.\""
          },
          {
            stem: "The honest conversation I keep almost having is about", end: "…",
            opts: [{ i: "🌱", t: "…something in our relationship I want to change but can't name yet" }, { i: "😔", t: "…how I've been feeling for longer than they know" }, { i: "💬", t: "…something they said that hurt me more than I showed" }, { i: "🔮", t: "…where I think we're headed — and whether we see the same thing" }],
            axis: "Axis C: Building → 'where we're headed' · Protecting → 'something they said'", cc: "\"If both pick the same option: 'You've both been circling the same conversation. That's the one to have.' Most powerful reveal.\""
          },
          {
            stem: "When I'm not being fully honest, it usually looks like", end: "…",
            opts: [{ i: "🙂", t: "…saying 'I'm fine' when I clearly am not" }, { i: "✅", t: "…agreeing to avoid the longer conversation" }, { i: "✏️", t: "…editing what I say to protect them from something they can't handle" }, { i: "🌊", t: "…letting things slide until they become too big to slide over" }],
            axis: "Axis A: Expressive → edit/protect · Active → agree to avoid/slide", cc: "\"The way you hide is often the way they're hidden from. This answer is a mirror.\""
          },
          {
            stem: "The thing I've been most honest about in this relationship and am glad I was is", end: "…",
            opts: [{ i: "🙋", t: "…something I needed that I finally found the courage to ask for" }, { i: "🫀", t: "…a feeling I almost talked myself out of sharing" }, { i: "💬", t: "…a hard observation about us that I shared not knowing how it would land" }, { i: "🪞", t: "…something I admitted about myself that shifted everything between us" }],
            axis: "Axis B: Deep → shifted how we see each other · Present → found courage in the moment", cc: "\"This question celebrates honesty that's already happened. Warmest couple card in this set.\""
          },
          {
            stem: "If I could make honesty easier, the one thing I'd change is", end: "…",
            opts: [{ i: "🛡️", t: "…how safe it feels to say the hard thing without worrying about the reaction" }, { i: "👂", t: "…our ability to hear feedback without it becoming a fight" }, { i: "✏️", t: "…my own reluctance — I edit myself more than they deserve" }, { i: "⏱️", t: "…how long it takes us to get to the real conversation" }],
            axis: "Axis C: Building → change patterns · Protecting → 'safe to say it'", cc: "\"If they pick self-reluctance and you also do — you're both editing. That's a shared thing that's worth naming.\""
          }
        ]
      },
      {
        title: "Set B — Receiving Honesty", theme: "Questions about how the user handles it when their partner is honest with them — the receiving side.",
        qs: [
          {
            stem: "When my partner is honest with me about something hard, my first instinct is", end: "…",
            opts: [{ i: "🛡️", t: "…to defend myself, even when they're right" }, { i: "🤐", t: "…to go quiet and process before I can respond" }, { i: "❓", t: "…to ask more questions — I want to understand fully first" }, { i: "🌊", t: "…to feel the thing and come back to the conversation later" }],
            axis: "Axis A: Active → ask more / defend · Expressive → go quiet / feel first", cc: "\"One of you defends, one goes quiet — or both do the same. Either way, this is the most useful thing to know about each other.\""
          },
          {
            stem: "The kind of honesty I find easiest to receive is", end: "…",
            opts: [{ i: "💚", t: "…something said with care — even if the content is hard" }, { i: "🫀", t: "…honesty about feelings — easier than honesty about behaviours" }, { i: "🤍", t: "…anything that comes with 'this is coming from love'" }, { i: "🔓", t: "…any honesty, actually — I'd rather know than not" }],
            axis: "Axis B: Deep → feelings / would rather know · Present → care in delivery", cc: "\"The last option is rare and important. If they pick it — they're giving permission for full honesty. Honour it.\""
          },
          {
            stem: "The kind of honesty I find hardest to receive is", end: "…",
            opts: [{ i: "🪞", t: "…when they're right about something I've been avoiding in myself" }, { i: "⚡", t: "…honesty in frustration — even when the observation is accurate" }, { i: "🔁", t: "…feedback about patterns — it feels bigger than any single incident" }, { i: "🔮", t: "…anything that makes me worry about where we're going" }],
            axis: "Axis C: Building → worried about direction · Protecting → pattern feedback", cc: "\"If both pick delivery-in-frustration: you both shut down when things get heated. That's the structural thing to fix first.\""
          },
          {
            stem: "The thing I wish my partner knew about receiving honesty from them is", end: "…",
            opts: [{ i: "⏳", t: "…I need a moment — but I always come back" }, { i: "🎭", t: "…the delivery matters as much as the content" }, { i: "🤝", t: "…I hear them better when their defences aren't up either" }, { i: "💙", t: "…what they share honestly makes me trust them more, not less" }],
            axis: "Axis A: Expressive → trust grows · Active → delivery / defences", cc: "\"This is the instruction manual for honest conversations with this person. Show them this answer. Ask them to honour it.\""
          },
          {
            stem: "A moment my partner was honest with me and I'm grateful for is", end: "…",
            opts: [{ i: "🌱", t: "…something I resisted at first but knew was true" }, { i: "🏷️", t: "…a time they named something I wasn't ready to name myself" }, { i: "🙋", t: "…when they told me what they needed instead of waiting for me to guess" }, { i: "🔄", t: "…something uncomfortable that changed how I see us — for better" }],
            axis: "Axis B: Deep → named something hidden · Present → told me what they needed now", cc: "\"Gratitude for honesty is the best couple card in this set. Both answers create a portrait of a relationship that's already doing the work.\""
          }
        ]
      },
      {
        title: "Set C — The Editing", theme: "Questions about self-censorship — what gets filtered, why, and what would happen if it stopped.",
        qs: [
          {
            stem: "The version of myself I present to my partner most often is", end: "…",
            opts: [{ i: "🌿", t: "…mostly real — I don't edit much, but I smooth some edges" }, { i: "🎭", t: "…the composed version — not false, but not fully unguarded" }, { i: "🌦️", t: "…very real on good days — more curated when it's hard" }, { i: "🤔", t: "…I'm not sure — I've been doing it so long I've lost track" }],
            axis: "Axis A: Expressive → composed version · Active → not sure anymore", cc: "\"If both pick 'not sure' — that's the most honest and most telling answer in the set.\""
          },
          {
            stem: "The thing I edit most when I talk to my partner is", end: "…",
            opts: [{ i: "💔", t: "…how much something actually hurt me" }, { i: "😨", t: "…how scared I am underneath what I'm calling frustration" }, { i: "🫀", t: "…how much I sometimes need — and how embarrassed I am by needing" }, { i: "💭", t: "…the full depth of what I want for us — it feels like too much to say" }],
            axis: "Axis B: Deep → depth of wanting · Present → hurt/scared in the moment", cc: "\"Fear of saying 'too much' is one of the most common quiet barriers in long-term love. This answer names it.\""
          },
          {
            stem: "The reason I edit myself is usually", end: "…",
            opts: [{ i: "🤍", t: "…I don't want to burden them with the full weight of what I carry" }, { i: "🤔", t: "…I'm not sure they can hold the unedited version" }, { i: "😨", t: "…I'm afraid saying it makes it more real than I'm ready for" }, { i: "📚", t: "…past experience taught me it doesn't always land the way I intend" }],
            axis: "Axis C: Protecting → burden · Building → past experience taught me", cc: "\"If they pick 'not sure they can hold it' — this is the trust gap. Worth naming, carefully, with warmth.\""
          },
          {
            stem: "The one thing I've never quite said fully to my partner is", end: "…",
            opts: [{ i: "🌱", t: "…how much this relationship has changed who I am" }, { i: "😨", t: "…how frightening it is to love someone this much" }, { i: "🙋", t: "…that sometimes I need reassurance I'm too proud to ask for" }, { i: "💭", t: "…exactly how I see us — the full, honest version" }],
            axis: "Axis B: Deep → how it's changed me · Present → need reassurance now", cc: "\"Most powerful question in this set. If both pick 'how frightening it is to love this much' — sit with that for a minute before saying anything.\""
          },
          {
            stem: "If I could stop editing for one conversation, I would say something close to", end: "…",
            opts: [{ i: "💚", t: "…'I love this — and it scares me in a way I don't know what to do with'" }, { i: "🙋", t: "…'I need more from you in a specific way and asking feels enormous'" }, { i: "😔", t: "…'I'm more uncertain than I let on and holding it alone is exhausting'" }, { i: "🌟", t: "…'You are one of the most important things in my life and I don't say that enough'" }],
            axis: "Axis A: Expressive → fear/love · Active → needs/uncertainty", cc: "\"This is the closing question in the set. Couple card: whatever they both pick — read it out loud to each other.\""
          }
        ]
      }
    ]
  },

  playful: {
    label: "Playful", emoji: "🎈", color: "#E67E22", bg: "#FEF0E6",
    sets: [
      {
        title: "Set A — Missing the Fun", theme: "Questions about what playfulness has been lost and what the couple misses about their lighter selves.",
        qs: [
          {
            stem: "The version of us I miss most is the one where we used to", end: "…",
            opts: [{ i: "😂", t: "…laugh at absolutely nothing — just each other, for no reason at all" }, { i: "🎲", t: "…do random unplanned things on a weeknight just because" }, { i: "🤫", t: "…have those long conversations about everything until 2am" }, { i: "🌀", t: "…surprise each other with the smallest things and it felt like a big deal" }],
            axis: "Axis A: Expressive → laughs/conversations · Active → spontaneous/surprises", cc: "\"You miss the laughs. They miss the adventures. What you both miss is yourselves when you weren't so busy.\""
          },
          {
            stem: "The way my partner makes me laugh that no one else could replicate is when they", end: "…",
            opts: [{ i: "🎭", t: "…do that one specific face or impression — our private language" }, { i: "🎯", t: "…say the exact thing I was thinking at the exact wrong moment" }, { i: "🌊", t: "…fully commit to something ridiculous without breaking" }, { i: "🧀", t: "…say something genuinely terrible and mean it completely seriously" }],
            axis: "Axis B: Deep → private language/mind-reading · Present → commits fully right now", cc: "\"High match expected. Couples share humour types. Match = 'You are each other's funniest person and you both know it.'\""
          },
          {
            stem: "If I could bring one habit from early on back into today, it would be the way we used to", end: "…",
            opts: [{ i: "📱", t: "…text each other ridiculous things just to make the other one smile" }, { i: "🎉", t: "…celebrate tiny wins out of proportion — a good meal felt like an occasion" }, { i: "🚶", t: "…walk somewhere with no destination, just talking" }, { i: "🎵", t: "…play music together — in the car, at home, as a whole mood" }],
            axis: "Axis A: Expressive → texts/walks · Active → celebrate / music", cc: "\"You want the words back. They want the movement back. Between you — that's the whole relationship.\""
          },
          {
            stem: "The funniest thing that belongs only to us — that no one else would understand — is something like", end: "…",
            opts: [{ i: "🤌", t: "…a word or phrase that only we know — our whole private language" }, { i: "📍", t: "…a place or moment that became a reference for everything" }, { i: "🎭", t: "…a running bit that started as a joke and is now just part of us" }, { i: "😬", t: "…a shared cringe memory we still can't believe happened but secretly love" }],
            axis: "Axis B: Deep — all options · Axis C: Protecting — all options", cc: "\"If they both pick the same thing: 'You both know what it is without naming it.' Warmest reveal in the set.\""
          },
          {
            stem: "Keeping a relationship playful over the long run is really about making sure we", end: "…",
            opts: [{ i: "🧩", t: "…protect our private world — the references, rituals, jokes that are just ours" }, { i: "🎢", t: "…keep trying new things so we never stop surprising each other" }, { i: "🤡", t: "…give each other permission to be ridiculous — no image to maintain" }, { i: "📵", t: "…make time where neither of us is half-somewhere else" }],
            axis: "Axis C: Protecting → private world · Building → new things/surprises", cc: "\"You protect the us that already exists. They keep adding to it. That's how the inside jokes survive the years.\""
          }
        ]
      },
      {
        title: "Set B — Shared Language", theme: "Questions about the private world the couple has built — the code, the jokes, the things only they understand.",
        qs: [
          {
            stem: "The thing I love most about our private language is", end: "…",
            opts: [{ i: "🌊", t: "…how it built without us trying — it just happened" }, { i: "🔐", t: "…that no one else understands it — and that's completely the point" }, { i: "🎭", t: "…that we can use it in public and only we know" }, { i: "🏗️", t: "…it's proof we've built something entirely and specifically our own" }],
            axis: "Axis B: Deep → proof of what we've built · Present → using it right now", cc: "\"Whatever they pick — this question is a celebration. Frame it that way. No wrong answer.\""
          },
          {
            stem: "The in-joke or reference that would need the most explaining to an outsider is", end: "…",
            opts: [{ i: "🗣️", t: "…a word or phrase that started as something else and became everything" }, { i: "😶", t: "…a face or gesture that says a whole paragraph" }, { i: "📍", t: "…something from a specific moment that became permanent shorthand" }, { i: "😂", t: "…something only funny in our specific context — which is only ours" }],
            axis: "Axis B: Deep — all options carry deep signal", cc: "\"Match here means you both know the same thing. Both point to the same moment — those are the memories to keep protecting.\""
          },
          {
            stem: "When my partner makes me actually laugh — not politely, but genuinely — it usually comes from", end: "…",
            opts: [{ i: "⏱️", t: "…perfect timing — they waited exactly the right beat" }, { i: "😐", t: "…something completely deadpan that lands like a bomb" }, { i: "🎯", t: "…finding the absurdity in something I was taking too seriously" }, { i: "🧠", t: "…knowing exactly what I find funny even when others don't" }],
            axis: "Axis A: Active → timing/deadpan · Expressive → knows me / absurdity", cc: "\"If they pick 'knows exactly what I find funny' — that's the most intimate answer in the set.\""
          },
          {
            stem: "The thing I most want to protect about our private world is", end: "…",
            opts: [{ i: "🗣️", t: "…our vocabulary — the specific words we use just for us" }, { i: "📸", t: "…the memories that became permanent references" }, { i: "🎭", t: "…the bits — the ones we still run years later" }, { i: "🤝", t: "…the shorthand — being able to say everything in three words" }],
            axis: "Axis C: Protecting — all options", cc: "\"This whole question is a love letter to what they've built. Couple card: 'Protect all of it.'\""
          },
          {
            stem: "The playfulness I most want to hold onto as we get older and busier is", end: "…",
            opts: [{ i: "🤡", t: "…being completely stupid with each other with no audience" }, { i: "😂", t: "…finding the funny side of the things that stress us" }, { i: "🗣️", t: "…our private language — all of it" }, { i: "🪞", t: "…the permission to not take each other, or ourselves, too seriously" }],
            axis: "Axis C: Protecting — all options point to what's worth keeping", cc: "\"The closing anchor for this set. Whatever they both pick — the couple card is: 'Protect that thing first.'\""
          }
        ]
      },
      {
        title: "Set C — Bringing It Back", theme: "Questions about actively reclaiming lightness — the doing of it, not just the missing of it.",
        qs: [
          {
            stem: "The most fun we've had together recently was", end: "…",
            opts: [{ i: "🎲", t: "…something completely unplanned that became the best night" }, { i: "😂", t: "…something small that for some reason we both found hilarious" }, { i: "🤡", t: "…a moment of pure silliness that reminded me why I love this person" }, { i: "✨", t: "…something I can still feel the lightness from" }],
            axis: "Axis A: Active → unplanned · Expressive → still feel it", cc: "\"This is a celebration that's already happened. The couple card: 'That's the template. Do it again.'\""
          },
          {
            stem: "The thing I'd do right now just to make my partner laugh is", end: "…",
            opts: [{ i: "😬", t: "…something embarrassing I know specifically lands with them" }, { i: "🗣️", t: "…reference our private language with perfect timing" }, { i: "🎭", t: "…pick the thing requiring the most commitment and fully commit" }, { i: "📱", t: "…send something so attuned to their humour it needs no explanation" }],
            axis: "Axis A: Active → embarrassing/commitment · Expressive → private language/send", cc: "\"This is active playfulness. Couple card: 'Do the thing you just described. Tonight.'\""
          },
          {
            stem: "The kind of fun I want more of is", end: "…",
            opts: [{ i: "⚡", t: "…spontaneous fun — not planned, just happened" }, { i: "🚶", t: "…physical fun — movement and doing, not just watching" }, { i: "🤡", t: "…stupid fun — completely enjoyable for no real reason" }, { i: "🧠", t: "…deep fun — the kind that comes from knowing each other so well it produces its own comedy" }],
            axis: "Axis A: Active → spontaneous/physical · Expressive → deep/stupid", cc: "\"If they pick the same — you know exactly what to plan next. If different — do both.\""
          },
          {
            stem: "The playful ritual I'd most want to bring back is", end: "…",
            opts: [{ i: "⏪", t: "…something from early on that we let slip when life got busier" }, { i: "🌿", t: "…a small consistent habit that was just ours" }, { i: "🤍", t: "…something silly I didn't realise I missed until it was gone" }, { i: "🌙", t: "…an evening routine that made ordinary weeks feel good" }],
            axis: "Axis C: Protecting — all options signal wanting what was", cc: "\"If both pick the unnamed thing: 'You both miss the same thing and neither named it. Name it tonight.'\""
          },
          {
            stem: "I know we're at our best when we're laughing because", end: "…",
            opts: [{ i: "🛡️", t: "…it means we both let our guards down at the same time" }, { i: "🎭", t: "…it means we're not performing anything — just being" }, { i: "🔐", t: "…the relationship feels like an inside joke we're both running" }, { i: "💡", t: "…it reminds me we chose each other partly for this — and it still works" }],
            axis: "Axis B: Deep → 'still works' · Present → guards down right now", cc: "\"This is the emotional conclusion of the Playful set. Whatever they pick — the couple card reads warmly.\""
          }
        ]
      }
    ]
  },

  open: {
    label: "Open", emoji: "🚪", color: "#6053C0", bg: "#EEEDFE",
    sets: [
      {
        title: "Set A — What I Hide", theme: "Questions about what the user guards, why they guard it, and what they imagine would happen if they didn't.",
        qs: [
          {
            stem: "The part of me I find hardest to show my partner is", end: "…",
            opts: [{ i: "😨", t: "…my real fears — not the surface ones, the ones that keep me up" }, { i: "🙋", t: "…how much I need approval and reassurance, even when I act like I don't" }, { i: "🌧️", t: "…the version of me that doesn't have it together" }, { i: "💭", t: "…what I actually want — the full, unedited version" }],
            axis: "Axis B: Deep → real fears/what I actually want · Present → need reassurance now", cc: "\"Whatever they pick — this is the thing to hold carefully. It's not a problem. It's a trust.\""
          },
          {
            stem: "The reason I keep certain things closed off is usually", end: "…",
            opts: [{ i: "📚", t: "…I learned early that showing too much isn't safe" }, { i: "🤍", t: "…I don't want to be a burden — they have their own things" }, { i: "🤔", t: "…I'm not sure they can hold the unedited version" }, { i: "🌊", t: "…I'm still figuring out what the unedited version even is" }],
            axis: "Axis C: Protecting → burden fear · Building → 'still figuring out'", cc: "\"If they pick 'not sure they can hold it' — this is a trust gap worth addressing gently. Most important answer in this set.\""
          },
          {
            stem: "The wall I keep up most instinctively is", end: "…",
            opts: [{ i: "🙂", t: "…the one that says 'I'm fine' before anyone can ask" }, { i: "🎭", t: "…the one that makes me seem more certain than I am" }, { i: "🤐", t: "…the one that says 'I don't need' before it becomes 'I need'" }, { i: "🛡️", t: "…the one that looks like distance but is actually self-protection" }],
            axis: "Axis A: Expressive → 'I'm fine'/distance · Active → seem certain/don't need", cc: "\"Your wall is just your pattern. It's not the truth. Knowing it's there is already most of the work.\""
          },
          {
            stem: "The thing I'm most guarded about — and part of me wishes I wasn't — is", end: "…",
            opts: [{ i: "📖", t: "…my history — certain parts I've never told anyone fully" }, { i: "🫀", t: "…how much this relationship means to me — saying it feels like too much" }, { i: "🪞", t: "…my insecurities — the irrational ones I can't quite shake" }, { i: "🔮", t: "…what I want for us — naming it gives it the power to disappoint" }],
            axis: "Axis B: Deep — all options · Axis C: Protecting → 'too much' · Building → 'power to disappoint'", cc: "\"'Saying it feels like too much' is the most common answer here. Couple card: 'It's not too much. It's what love actually sounds like.'\""
          },
          {
            stem: "If I lowered my guard more with my partner, I think what would happen is", end: "…",
            opts: [{ i: "🌍", t: "…they'd know me better than anyone has — and that's what scares me" }, { i: "🔄", t: "…something would shift in a way I can't predict — and I'm not ready" }, { i: "🌱", t: "…they'd probably feel closer, even if I felt more vulnerable" }, { i: "🤔", t: "…I think it would be okay — but 'probably okay' isn't the same as feeling safe" }],
            axis: "Axis B: Deep → 'know me better' · Present → 'probably okay'", cc: "\"'Probably okay' is the most vulnerable and honest answer in the set. If both pick it: start there.\""
          }
        ]
      },
      {
        title: "Set B — Letting More In", theme: "Questions about the conditions for openness and what each person needs to feel safe enough to let down the guard.",
        qs: [
          {
            stem: "The thing my partner does that makes me feel safe enough to open up is", end: "…",
            opts: [{ i: "⏳", t: "…not reacting immediately — giving it space to land" }, { i: "❓", t: "…asking a second question instead of jumping to advice" }, { i: "🛡️", t: "…making me feel like sharing won't change how they see me" }, { i: "🔓", t: "…opening up about something themselves first" }],
            axis: "Axis A: Active → asks more / opens first · Expressive → gives space / makes me feel safe", cc: "\"This is the instruction manual for creating safety with this person. If they see each other's answers — they know exactly what to do.\""
          },
          {
            stem: "The moment I feel most able to be open is usually", end: "…",
            opts: [{ i: "🌙", t: "…in the dark, at the end of the day, when the filters come down" }, { i: "🚗", t: "…in the car — something about movement and not facing each other" }, { i: "💥", t: "…right after something real has happened — when the guard is already low" }, { i: "🔓", t: "…when they've just been vulnerable with me — it opens a door" }],
            axis: "Axis B: Deep → end of day / after real thing · Present → car / in the moment", cc: "\"Knowing when each person opens up is one of the most practically useful things in this set. Try meeting them there.\""
          },
          {
            stem: "The version of openness I want more from my partner is", end: "…",
            opts: [{ i: "😔", t: "…them telling me what they're actually worried about, not the easy version" }, { i: "🌧️", t: "…seeing who they are on the really hard days, not just the composed ones" }, { i: "💬", t: "…their real opinions — even when they think I won't agree" }, { i: "📖", t: "…the history that made them who they are — the parts from before us" }],
            axis: "Axis B: Deep — all options", cc: "\"This is an ask. The partner sees it as a direct invitation — one of the most valuable couple reveals in this set.\""
          },
          {
            stem: "Being truly open in this relationship means letting them see me", end: "…",
            opts: [{ i: "😔", t: "…on the days I don't like myself very much" }, { i: "🤔", t: "…uncertain and not trying to perform certainty" }, { i: "🙋", t: "…needing something — without the edit that makes the need smaller" }, { i: "🧩", t: "…the version that hasn't figured it all out yet" }],
            axis: "Axis C: Building — all options point toward growth through exposure", cc: "\"'The version that hasn't figured it all out yet' is the truest answer. Also the hardest. If both pick it: sit with it together.\""
          },
          {
            stem: "The thing I've opened up about that I'm glad I did is", end: "…",
            opts: [{ i: "🔐", t: "…something I'd never told anyone and they received it well" }, { i: "😨", t: "…a fear I thought would make them see me differently — and it didn't" }, { i: "🙋", t: "…a need I finally named after years of leaving it unnamed" }, { i: "🔒", t: "…something about my past I'd kept tightly shut for a long time" }],
            axis: "Axis B: Deep — all options", cc: "\"This is proof that openness has already worked. Warmest question in this set. End here.\""
          }
        ]
      },
      {
        title: "Set C — Receiving Openness", theme: "Questions about what happens when the partner opens up — how the user holds what they're given.",
        qs: [
          {
            stem: "When my partner opens up to me about something vulnerable, my instinct is", end: "…",
            opts: [{ i: "🤍", t: "…to hold it carefully — it matters that they trusted me with it" }, { i: "🔄", t: "…to share something back — vulnerability should go both ways" }, { i: "🛡️", t: "…to make sure they don't regret it — I want them to feel safe" }, { i: "🌊", t: "…to sit with it without rushing to respond" }],
            axis: "Axis A: Active → shares back / holds carefully · Expressive → sits with it / make them feel safe", cc: "\"Different responses here aren't mismatches — they're complementary. The pair of answers is the full picture.\""
          },
          {
            stem: "The kind of openness I find easiest to receive from my partner is", end: "…",
            opts: [{ i: "🫀", t: "…feelings — I can hold those without needing to fix" }, { i: "💚", t: "…the good things — hopes, wants, the soft things" }, { i: "🔓", t: "…anything — I want all of it" }, { i: "📖", t: "…their history — who they were before I knew them" }],
            axis: "Axis B: Deep → history / feelings · Present → want all of it now", cc: "\"If they pick 'anything' — honour that. It's the rarest and most important gift of openness.\""
          },
          {
            stem: "The openness that's hardest to receive is", end: "…",
            opts: [{ i: "🔄", t: "…when sharing something requires me to change" }, { i: "⏰", t: "…when something has been hidden a long time and I'm just hearing it" }, { i: "🤐", t: "…when they need me to just be there and I don't know how" }, { i: "🆕", t: "…when what they share reveals something about them I have to adjust to" }],
            axis: "Axis C: Building → requires change · Protecting → 'just be there'", cc: "\"If both pick 'just be there' — you both need the same thing from each other and haven't said it.\""
          },
          {
            stem: "When I hold something my partner has shared, I show it's safe by", end: "…",
            opts: [{ i: "🚫", t: "…never using it against them — in arguments, in frustration, never" }, { i: "📋", t: "…asking about it later — showing it stayed with me" }, { i: "🔐", t: "…not sharing it with anyone else, ever" }, { i: "🎁", t: "…treating it like the gift it was — not like ordinary information" }],
            axis: "Axis A: Active → ask about it later · Expressive → never use it / treat as gift", cc: "\"Match here is powerful: 'You both protect what you're given the same way. That's why this works.'\""
          },
          {
            stem: "The thing I most want my partner to feel when they open up to me is", end: "…",
            opts: [{ i: "🎯", t: "…that this was the right person to tell" }, { i: "🌱", t: "…that nothing they shared changed how I see them — only added to it" }, { i: "🚪", t: "…that the door is always open for more" }, { i: "🤍", t: "…that what they gave me, I'll carry carefully" }],
            axis: "Axis B: Deep — all options", cc: "\"This is the closing anchor of the Open set. Read both answers out loud. Whatever they picked — that's the promise they're already making.\""
          }
        ]
      }
    ]
  },

  brave: {
    label: "Brave", emoji: "🦁", color: "#C0392B", bg: "#FEF3F3",
    sets: [
      {
        title: "Set A — The Hard Conversation", theme: "Questions about the conversations that haven't happened yet — what's unsaid and why.",
        qs: [
          {
            stem: "The conversation I keep almost having — but keep pulling back from — is about", end: "…",
            opts: [{ i: "🔮", t: "…where we're actually headed — and whether we're both going there together" }, { i: "😶", t: "…something they do that quietly bothers me but I keep letting go" }, { i: "🫀", t: "…something I need from this relationship that I haven't been able to ask for" }, { i: "📉", t: "…how I've been feeling — the version I haven't been showing them" }],
            axis: "Axis B: Deep — all options · Axis C: Building → 'where headed' · Protecting → 'something I need'", cc: "\"If both pick the same: 'You've both been circling the same conversation. That's the one to have.' Most powerful reveal.\""
          },
          {
            stem: "The bravest thing I've ever done inside this relationship was the time I chose to", end: "…",
            opts: [{ i: "🤍", t: "…stay and work through something instead of shutting down" }, { i: "🔊", t: "…say the honest thing even knowing it might land badly" }, { i: "🌱", t: "…ask for something I needed, even though it felt like asking too much" }, { i: "🔓", t: "…let them see me at my most undone — without editing it first" }],
            axis: "Axis A: Expressive → stay / undone · Active → say it / ask", cc: "\"You stayed. They spoke. The relationship needs both kinds of brave — and you each brought one.\""
          },
          {
            stem: "The thing I wish I could say without worrying how it lands is something close to", end: "…",
            opts: [{ i: "💭", t: "…'I need you to hear me differently than you do right now'" }, { i: "🫂", t: "…'I need more from you and I'm scared to say that out loud'" }, { i: "🌊", t: "…'I'm not okay and I've been pretending I am for longer than you know'" }, { i: "🔮", t: "…'I'm afraid about where we're going and don't know how to bring it up'" }],
            axis: "Axis B: Deep — all options · Axis C: Building → 'where going' · Protecting → 'not okay'", cc: "\"⚠️ Handle with care. If both pick the same: 'You've both been carrying the same thing.' Most powerful reveal in this set.\""
          },
          {
            stem: "The brave thing I want more of from us — the thing we keep almost doing — is being willing to", end: "…",
            opts: [{ i: "🎯", t: "…take a real risk together — the kind where both of us have something at stake" }, { i: "🪟", t: "…have the hard conversation before it builds into something bigger" }, { i: "🌍", t: "…bet on us visibly — a decision, a commitment, something that says 'we chose this'" }, { i: "📖", t: "…tell each other the parts of our stories we haven't shared yet" }],
            axis: "Axis A: Active → risk/commitment · Expressive → conversation/stories", cc: "\"Your brave is emotional. Theirs is a decision. Between you — that covers both kinds of courage.\""
          },
          {
            stem: "What being truly brave in love ultimately means to me is having the courage to", end: "…",
            opts: [{ i: "🏠", t: "…stay and work on the hard thing instead of going quiet" }, { i: "🗣️", t: "…say the thing that might change everything" }, { i: "🔁", t: "…keep choosing this person even on days when choosing is hard" }, { i: "📬", t: "…let them see who I really am — not the version I've curated" }],
            axis: "Axis C: Protecting → 'keep choosing' · Building → 'say the thing'", cc: "\"You chose staying. They chose saying. You've been brave in all the right places.\""
          }
        ]
      },
      {
        title: "Set B — Acts of Courage", theme: "Questions about brave things already done — celebrating the courage that's already shown up in the relationship.",
        qs: [
          {
            stem: "The bravest thing I've done in this relationship that nobody saw was", end: "…",
            opts: [{ i: "💚", t: "…choosing to trust when I had good reasons not to" }, { i: "🏠", t: "…deciding to stay on a day when leaving felt like the easier option" }, { i: "💬", t: "…saying something I was terrified to say and watching the world not end" }, { i: "🙋", t: "…asking for help when I was raised to never need it" }],
            axis: "Axis A: Active → said it / asked · Expressive → trusted / stayed", cc: "\"This is invisible courage. The partner is seeing it for the first time. The couple card should feel like a reveal.\""
          },
          {
            stem: "The act of courage in love that gets the least credit is", end: "…",
            opts: [{ i: "📅", t: "…showing up consistently, even when it's unremarkable" }, { i: "🙋", t: "…asking for what you need before you've given up needing it" }, { i: "🪞", t: "…saying 'I was wrong' before being asked to" }, { i: "🤍", t: "…staying soft in the moments that tempt you to go hard" }],
            axis: "Axis A: Active → shows up · Expressive → stays soft / says I was wrong", cc: "\"The answer here is their definition of love. Couple card: 'You're already doing this. Do you know that?'\""
          },
          {
            stem: "Something that took more courage than I expected was", end: "…",
            opts: [{ i: "🔐", t: "…the first time I told them something I'd kept hidden" }, { i: "🔄", t: "…choosing to repair after a fight when part of me wanted to stay injured" }, { i: "💬", t: "…admitting I needed them more than I was comfortable admitting" }, { i: "😊", t: "…letting myself be happy without waiting for the other shoe to drop" }],
            axis: "Axis B: Deep → told hidden thing · Present → let myself be happy now", cc: "\"'Letting myself be happy' is the most quietly vulnerable answer in the set. If both pick it — that says everything.\""
          },
          {
            stem: "The kind of courage I've developed because of this relationship is", end: "…",
            opts: [{ i: "🙋", t: "…saying I need something without apologising for needing it" }, { i: "🌊", t: "…staying in the discomfort instead of escaping it" }, { i: "🔓", t: "…trusting someone with the version of me that isn't performing" }, { i: "🔄", t: "…coming back after conflict instead of going cold" }],
            axis: "Axis A: Active → comes back · Expressive → trusts / stays in discomfort", cc: "\"This couple card should read: 'You didn't have this before. You built it together. That's the relationship doing exactly what it's for.'\""
          },
          {
            stem: "The act of bravery I most want to practice going forward is", end: "…",
            opts: [{ i: "💬", t: "…having the conversations I've been circling instead of having" }, { i: "🙋", t: "…asking for what I want clearly — not hoping they'll guess" }, { i: "🤝", t: "…being the one who reaches first when things go quiet between us" }, { i: "🔓", t: "…letting myself be as known by them as they are by me" }],
            axis: "Axis C: Building → all options point toward growth", cc: "\"This is a forward commitment. The couple card: 'You just named what you want to do next. Now you've said it out loud.'\""
          }
        ]
      },
      {
        title: "Set C — Forward Courage", theme: "Questions about what bravery looks like going forward — the courage the relationship still needs.",
        qs: [
          {
            stem: "The brave version of us I want to be is one that", end: "…",
            opts: [{ i: "💬", t: "…can say the hard thing early — before it builds into something heavier" }, { i: "🎯", t: "…takes real chances together — not just safe ones" }, { i: "🚫", t: "…doesn't let things go unsaid because saying them is uncomfortable" }, { i: "🎪", t: "…bets on us visibly and without apology" }],
            axis: "Axis C: Building — all options signal wanting more", cc: "\"This is the vision. The couple card: 'You both just described the same future. Start building it.'\""
          },
          {
            stem: "The thing I want to be braver about in our relationship going forward is", end: "…",
            opts: [{ i: "🎤", t: "…initiating the conversations that matter most" }, { i: "🙋", t: "…asking for reassurance instead of pretending I don't need it" }, { i: "💬", t: "…disagreeing out loud instead of editing myself into false agreement" }, { i: "💭", t: "…naming what I want for us instead of waiting to see what happens" }],
            axis: "Axis A: Active → initiate/disagree · Expressive → ask for reassurance / name what I want", cc: "\"If both pick the same thing: 'You both want to be braver about the same thing. You have permission to go first.'\""
          },
          {
            stem: "The version of this relationship that would require the most courage looks like", end: "…",
            opts: [{ i: "💯", t: "…complete honesty — about needs, fears, doubts, and what I want" }, { i: "🌊", t: "…vulnerability without knowing the outcome — trust without certainty" }, { i: "🎪", t: "…making real commitments instead of leaving things conveniently open" }, { i: "🔁", t: "…choosing each other again, out loud, even when it's not required" }],
            axis: "Axis B: Deep — all options · Axis C: Building → real commitments", cc: "\"The relationship they want to have is the one they just described. Couple card: 'This is the version of you worth building.'\""
          },
          {
            stem: "The scariest thing about truly brave love is", end: "…",
            opts: [{ i: "🔓", t: "…how much it asks you to trust someone with the parts you protect most" }, { i: "🎲", t: "…that the outcome is never guaranteed — you just go anyway" }, { i: "🪞", t: "…that being fully known is the thing you want and the thing you fear equally" }, { i: "🚪", t: "…having to give up the exit in your head that made you feel safe" }],
            axis: "Axis B: Deep — all options", cc: "\"If both pick 'being known is what you want and fear equally': sit with that. Don't rush to the next question.\""
          },
          {
            stem: "If I could say one brave thing to my partner right now, it would be close to", end: "…",
            opts: [{ i: "💚", t: "…'I want more with you than I've been saying out loud'" }, { i: "😨", t: "…'I'm more afraid of losing this than I've ever let on'" }, { i: "🙋", t: "…'I need something from you that I've been too proud to ask for'" }, { i: "🌟", t: "…'What we have is the best thing I've got — and I don't say that enough'" }],
            axis: "Axis A: Expressive — all options", cc: "\"This is the closing anchor of the entire Brave set. Couple card: 'Read each other's answer out loud. That's the brave thing.'\""
          }
        ]
      }
    ]
  }
};

const WORDS = ["patient", "present", "honest", "playful", "open", "brave"];

export default function App() {
  const [word, setWord] = useState("patient");
  const [setIdx, setSetIdx] = useState(0);
  const [selOpts, setSelOpts] = useState({});

  const d = DATA[word];
  const s = d.sets[setIdx];

  const key = (qi, oi) => `${word}-${setIdx}-${qi}-${oi}`;
  const toggleOpt = (qi, oi) => {
    const k = `${word}-${setIdx}-${qi}`;
    setSelOpts(prev => ({ ...prev, [k]: prev[k] === oi ? null : oi }));
  };
  const isSel = (qi, oi) => selOpts[`${word}-${setIdx}-${qi}`] === oi;

  return (
    <div style={{ fontFamily: "system-ui,sans-serif", background: "#F4F8F6", minHeight: "100vh", padding: "22px 18px 60px", color: DK }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: DK, borderRadius: 14, padding: "18px 22px 16px", marginBottom: 18, color: "white" }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Finish My Sentence — All 6 Intentions</h1>
          <p style={{ fontSize: 12, color: "#7DBEAA", lineHeight: 1.6 }}>Select an intention word → pick a set → tap options to preview selections · 6 words × 3 sets × 5 questions = 90 questions total</p>
        </div>

        {/* Intention tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {WORDS.map(w => {
            const d2 = DATA[w];
            const on = w === word;
            return (
              <button key={w} onClick={() => { setWord(w); setSetIdx(0); }}
                style={{
                  padding: "9px 18px", borderRadius: 100, border: `1.5px solid ${on ? d2.color : "#D8EDE6"}`,
                  background: on ? d2.color : "white", color: on ? "white" : MD, fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "all .15s", display: "flex", alignItems: "center", gap: 6
                }}>
                {d2.emoji} {d2.label}
              </button>
            );
          })}
        </div>

        {/* Set tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {d.sets.map((s2, i) => (
            <button key={i} onClick={() => setSetIdx(i)}
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 10,
                border: `1.5px solid ${i === setIdx ? d.color : "#D8EDE6"}`,
                background: i === setIdx ? d.bg : "white", color: i === setIdx ? d.color : MD,
                fontSize: 12, fontWeight: 700, cursor: "pointer", textAlign: "left", lineHeight: 1.35
              }}>
              <div style={{ fontSize: 10, opacity: .65, marginBottom: 2 }}>Set {i + 1}</div>
              {s2.title.replace(/^Set [ABC] — /, "")}
            </button>
          ))}
        </div>

        {/* Set theme */}
        <div style={{ background: "white", borderRadius: 12, padding: "11px 15px", border: `.5px solid ${d.color}44`, marginBottom: 18, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{d.emoji}</span>
          <p style={{ fontSize: 12.5, color: d.color, fontStyle: "italic", lineHeight: 1.55 }}><strong>Emotional territory:</strong> {s.theme}</p>
        </div>

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {s.qs.map((q, qi) => (
            <div key={qi} style={{ background: "white", borderRadius: 14, border: `.5px solid #E8EDEB`, overflow: "hidden" }}>
              <div style={{ background: "#F8FAF9", padding: "13px 16px 10px", borderBottom: ".5px solid #E8EDEB" }}>
                <div style={{ fontSize: 9.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".1em", color: LT, marginBottom: 6 }}>Question {qi + 1} of 5</div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: 15.5, fontStyle: "italic", color: DK, lineHeight: 1.55 }}>
                  {q.stem} <strong style={{ color: d.color }}>{q.end}</strong>
                </p>
              </div>
              <div style={{ padding: "12px 16px" }}>
                {/* 2×2 options */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                  {q.opts.map((opt, oi) => {
                    const sel = isSel(qi, oi);
                    return (
                      <div key={oi} onClick={() => toggleOpt(qi, oi)}
                        style={{
                          borderRadius: 11, padding: "11px 12px", display: "flex", gap: 9, alignItems: "flex-start",
                          cursor: "pointer", border: `1.5px solid ${sel ? d.color : "#D8EDE6"}`,
                          background: sel ? d.bg : "white", transition: "all .12s"
                        }}>
                        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{opt.i}</span>
                        <span style={{
                          fontFamily: "Georgia,serif", fontSize: 12, fontStyle: "italic",
                          color: sel ? d.color : DK, lineHeight: 1.5, fontWeight: sel ? 600 : 400
                        }}>{opt.t}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Axis tag */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  <span style={{ fontSize: 10, padding: "2px 9px", borderRadius: 100, fontWeight: 600, background: d.bg, color: d.color }}>{q.axis}</span>
                </div>
                {/* Couple card */}
                <div style={{ background: "#F8FAF9", borderRadius: 9, padding: "8px 12px", border: ".5px solid #E8EDEB", display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>🔒</span>
                  <p style={{ fontSize: 11.5, color: MD, lineHeight: 1.5 }}><strong style={{ color: DK }}>Couple Card: </strong>{q.cc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 10 }}>
          <button onClick={() => setSetIdx(Math.max(0, setIdx - 1))} disabled={setIdx === 0}
            style={{
              flex: 1, padding: 13, borderRadius: 50, border: `1.5px solid ${d.color}`,
              background: "white", color: d.color, fontSize: 13, fontWeight: 700,
              cursor: setIdx === 0 ? "default" : "pointer", opacity: setIdx === 0 ? .4 : 1, fontFamily: "system-ui"
            }}>
            ← Previous Set
          </button>
          <button onClick={() => setSetIdx(Math.min(2, setIdx + 1))} disabled={setIdx === 2}
            style={{
              flex: 1, padding: 13, borderRadius: 50, border: "none",
              background: setIdx === 2 ? "#D8EDE6" : d.color, color: "white", fontSize: 13, fontWeight: 700,
              cursor: setIdx === 2 ? "default" : "pointer", fontFamily: "system-ui"
            }}>
            Next Set →
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: LT }}>
          {WORDS.indexOf(word) + 1} of 6 intention words · Set {setIdx + 1} of 3 · {s.qs.length} questions
        </div>
      </div>
    </div>
  );
}
