import { useEffect, useRef, useState } from 'react'

/* Recipes to Adult app, v7: soft pastel cards, circular top-down plates, frosted surfaces.
   Two type styles: Fraunces (titles, light + semibold mix) and Instrument Sans (everything else).
   Spacing: 16 / 24 / 32 / 48. */
export const C = { violet: '#4a4470', apricot: '#fad9c9', sun: '#fbe9b0', lilac: '#ddd6fa', mint2: '#cfecda', ink: '#1c1a2b', mute: '#55526a', peri: '#dfe3ff', periDeep: '#7c83e6', lav: '#ebe3ff', peach: '#ffe1d3', coral: '#ff7a5c', butter: '#fff1c7', mint: '#dcf1e4', glass: 'rgba(255,255,255,0.62)', bg: '#f6f4fb' }
const SERIF = { fontFamily: '"Fraunces", Georgia, serif' } as const
const U = (id: string, w = 700) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`
const PLATE_SHADOW = '0 26px 40px -18px rgba(60,48,120,0.55), 0 8px 14px -8px rgba(60,48,120,0.25)'
const CARD_SHADOW = '0 24px 48px -28px rgba(60,48,120,0.35)'

/* Title with the reference's light + bold serif mix, e.g. "Comfort *bowl*" (bold part in **). */
function T({ text, size = 26, className = '', light = '#1c1a2b' }: { text: string; size?: number; className?: string; light?: string }) {
  const parts = text.split('**')
  return <p className={`leading-[1.05] tracking-[-0.015em] ${className}`} style={{ ...SERIF, fontSize: size, color: light }}>{parts.map((p, i) => <span key={i} style={{ fontWeight: i % 2 ? 600 : 300 }}>{p}</span>)}</p>
}
const Meta = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => <p className={`text-[12px] ${className}`} style={{ color: C.mute }}>{children}</p>

/* circular top-down dish */
type Dish = { src: string; pos?: string; zoom?: number }
function Plate({ d, size, className = '', style }: { d: Dish; size: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`shrink-0 overflow-hidden rounded-full border-[5px] border-white ${className}`} style={{ width: size, height: size, boxShadow: PLATE_SHADOW, ...style }}>
      <img src={d.src} alt="" className="h-full w-full object-cover" style={{ objectPosition: d.pos ?? '50% 50%', scale: String(d.zoom ?? 1),  }} />
    </div>
  )
}
const I = {
  home: <><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></>,
  stories: <><path d="M5 4h10a4 4 0 014 4v12H9a4 4 0 01-4-4z" /><path d="M9 9h6M9 13h6" /></>,
  bento: <><rect x="3.5" y="5" width="17" height="14" rx="3" /><path d="M10 5v14M10 12h10.5" /></>,
  diary: <path d="M6 3h12v18l-6-4-6 4z" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></>,
  heart: <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />,
  chat: <path d="M20 12a8 8 0 01-11.6 7.1L4 20l1-4A8 8 0 1120 12z" />,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></>,
  people: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-4 3-6 7-6s7 2 7 6" /></>,
  flame: <path d="M12 3c1 4 6 6 6 11a6 6 0 01-12 0c0-3 2-5 3-6 0 2 1 3 2 3 0-3-1-5 1-8z" />,
  play: <path d="M8 5l11 7-11 7z" />,
  pause: <path d="M9 5v14M15 5v14" />,
  plus: <path d="M12 5v14M5 12h14" />,
}
const Ico = ({ d, size = 20, fill = 'none', w = 1.7 }: { d: React.ReactNode; size?: number; fill?: string; w?: number }) => <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
const Pill = ({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) => (
  <button onClick={onClick} disabled={disabled} className="flex h-14 flex-1 items-center justify-between rounded-full pl-6 pr-2 text-[15px] font-medium text-white transition active:scale-[.98] disabled:opacity-40" style={{ background: C.ink }}>{children}<span className="grid h-10 w-10 place-items-center rounded-full bg-white" style={{ color: C.ink }}><Ico d={I.plus} size={18} w={2.2} /></span></button>
)
const IconBtn = ({ d, onClick, on, label }: { d: React.ReactNode; onClick?: () => void; on?: boolean; label: string }) => (
  <button onClick={onClick} aria-label={label} className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl transition active:scale-95" style={{ background: C.glass, color: on ? C.coral : C.ink, backdropFilter: 'blur(12px)' }}><Ico d={d} size={22} fill={on ? C.coral : 'none'} /></button>
)

/* ---------- content ---------- */
type Step = { say: string; do: string; t: number; tell?: string }
type Recipe = { id: string; title: string; real: string; dish: Dish; photo: string; tint: string; mood: string; mins: number; level: string; serves: number; by: string; avatar: string; standfirst: string; story: string; ing: [string, string][]; cooked: number; rating: number; reviews: [string, string][]; steps: Step[] }
const RECIPES: Recipe[] = [
  { id: 'stew', title: 'Rainy-day **comfort bowl**', real: 'Chicken and potato stew', dish: { src: '/r2a/photo-5.jpg', pos: '56% 48%', zoom: 1.12 }, photo: '/r2a/photo-5.jpg', tint: C.apricot, mood: 'Homesick', mins: 30, level: 'Medium', serves: 2, by: 'Mary', avatar: '/r2a/photo-2.jpg', standfirst: 'For the first cold night in a flat that isn\u2019t home yet.', story: 'It was 2003, my first winter in Dublin. The heating ran on a coin meter and I never had coins. So I made the only thing my mother taught me, and for an hour the flat smelled like her kitchen.', ing: [['4', 'Potatoes'], ['2', 'Chicken thighs'], ['1', 'Onion'], ['2', 'Carrots'], ['1 L', 'Stock']], cooked: 412, rating: 5, reviews: [['Saoirse', 'Cried a bit. Good cry.'], ['Leo', 'Called my mam halfway through.']], steps: [
    { say: 'Get the pot warm first. The flat can stay cold, the pot can\u2019t.', do: 'Brown the chicken in a little oil.', tell: "That first winter, the pot was the warmest thing in the flat. So we start there. Put it on a medium heat with a little oil, and wait until it shimmers. Now lay the chicken in, skin down, and leave it alone. Don't poke it. Let it go golden, about five minutes, and it'll let go of the pan when it's ready.", t: 5 },
    { say: 'If you cry, blame the onion, not the rent.', do: 'Add the onion and let it soften.', tell: "My mother always said the onion is where you get to cry for free. Chop it roughly, nothing fancy. Tip it into the pan with the chicken, and give it a stir. Turn the heat down a little. We're not frying it, we're just letting it go soft and sweet. Three minutes or so. Take a breath.", t: 3 },
    { say: 'This is where it starts to smell like somewhere.', do: 'Add the potatoes, carrots and stock.', tell: "This is the moment the flat started to smell like somewhere. Add your potatoes and carrots, cut into big honest chunks. Pour in the stock, slowly, until everything's just covered. Scrape the bottom of the pan with your spoon. All that brown stuff is flavour. Bring it up to a gentle bubble.", t: 10 },
    { say: 'Turn it down. Ring someone you miss.', do: 'Simmer with the lid half on.', tell: "Now, turn it right down. Put the lid on, but leave a little gap, like a door left open. It needs about fifteen minutes. You don't have to stand over it. This is when I'd ring home. Maybe ring someone you miss. The stew will wait for you.", t: 15 },
    { say: 'A bowl you hold with both hands.', do: 'Season and serve.', tell: "Taste it. Really taste it. A pinch of salt, a little pepper, and taste again. When it tastes like a hug, it's ready. Ladle it into the biggest bowl you own, and hold it with both hands. You did that. Welcome home.", t: 2 },
  ] },
  { id: 'bowl', title: 'The **forgot-groceries** special', real: 'Fridge-raid fried rice', dish: { src: U('1788090485545-26c4d90f9c9f'), pos: '50% 50%', zoom: 1.2 }, photo: U('1788090485545-26c4d90f9c9f'), tint: C.sun, mood: 'Broke', mins: 12, level: 'Easy', serves: 1, by: 'Jack', avatar: '/r2a/photo-4.jpg', standfirst: 'Rice, an egg and whatever the fridge is hiding.', story: 'Payday was four days away. I had rice, one egg and half an avocado. It was the best thing I ate all month.', ing: [['1 cup', 'Leftover rice'], ['1', 'Egg'], ['½', 'Avocado'], ['1 tbsp', 'Chilli oil']], cooked: 1208, rating: 4, reviews: [['Maya', 'Low effort, high reward.'], ['Aoife', 'Week four of this. No regrets.']], steps: [
    { say: 'Cold rice is a gift. Hot pan, no fuss.', do: 'Fry the rice until it crisps.', tell: "Payday was four days away, and I had a box of cold rice. Turns out, cold rice is a gift. Get your pan properly hot, add a splash of oil, and tip the rice in. Press it down flat and leave it. Don't stir. Let the bottom go crispy and loud, about four minutes.", t: 4 },
    { say: 'Crack it right in. Messy counts.', do: 'Push the rice aside and fry the egg.', tell: "Push the rice over to one side of the pan, and make a little space. Crack your egg right in there. It doesn't need to be pretty. Messy still counts. Let the white set, then break the yolk and fold it through the rice, so every bit gets a bit of gold.", t: 3 },
    { say: 'Everything in the fridge is a topping now.', do: 'Top with avocado and sauce.', tell: "Now, everything in your fridge is a topping. Slide it into a bowl. Slice the avocado over the top, and spoon on the chilli oil. Sit down to eat it. Not standing at the counter. You've earned a chair tonight.", t: 2 },
  ] },
  { id: 'pasta', title: 'Pasta for the **main character**', real: 'Tomato and basil spaghetti', dish: { src: U('1729268353430-5ec3449e3063'), pos: '50% 50%', zoom: 1.4 }, photo: U('1729268353430-5ec3449e3063'), tint: C.lilac, mood: 'Restless', mins: 20, level: 'Medium', serves: 2, by: 'Saoirse', avatar: '/r2a/street-1.jpg', standfirst: 'For nights that deserve a soundtrack.', story: 'I cook this when I need to feel like the film is about me. Candles, one good song on repeat, and pasta twirled like it matters.', ing: [['200 g', 'Spaghetti'], ['1 tin', 'Tomatoes'], ['2', 'Garlic cloves'], ['A handful', 'Basil']], cooked: 864, rating: 4, reviews: [['Jack', 'Second date confirmed.'], ['Niamh', 'Felt like being in a film.']], steps: [
    { say: 'Salt the water like the sea.', do: 'Boil the pasta until just tender.', tell: "Fill your biggest pot with water and put it on to boil. When it's bubbling hard, salt it. Properly. It should taste like the sea. Drop the spaghetti in and give it a stir so nothing sticks. Nine minutes. Put a song on while you wait. Pick a good one.", t: 9 },
    { say: 'Low and slow, until it turns jammy.', do: 'Simmer tomatoes with garlic and oil.', tell: "In a pan, warm a good glug of olive oil, and slice in the garlic. Keep the heat low. You want it to smell sweet, not to burn. Now pour in the tomatoes, and let them bubble gently. Squash them with your spoon as you go. Low and slow, until it turns thick and jammy.", t: 8 },
    { say: 'Toss it like someone is watching.', do: 'Fold the pasta through the sauce.', tell: "Before you drain the pasta, save a little of that cooking water. Lift the spaghetti straight into the sauce, with a splash of the water. Now toss it. Toss it like someone is watching, like you're in a film. Tear the basil over the top. That's your scene.", t: 2 },
  ] },
  { id: 'egg', title: 'A Sunday **reset**', real: 'Fried egg and greens', dish: { src: U('1691480184494-d9f822edd4d1'), pos: '50% 50%', zoom: 1.12 }, photo: U('1691480184494-d9f822edd4d1'), tint: C.mint2, mood: 'Calm', mins: 10, level: 'Easy', serves: 1, by: 'Maya', avatar: '/r2a/photo-1.jpg', standfirst: 'Slow morning, clean sheets, a plate that says you\u2019re fine.', story: 'After a rough week I make this before I open my phone. It\u2019s the only ten minutes that are just mine.', ing: [['2', 'Eggs'], ['A handful', 'Greens'], ['1', 'Slice of sourdough'], ['A pinch', 'Chilli flakes']], cooked: 530, rating: 5, reviews: [['Leo', 'The ten minutes are real.'], ['Saoirse', 'Phone stayed face down.']], steps: [
    { say: 'Low heat. Nothing about today needs rushing.', do: 'Warm a little butter in the pan.', tell: "It's Sunday. Your phone can wait. Put the pan on a low heat, and add a little butter. Watch it melt and start to foam. Nothing about today needs rushing, so don't rush this either.", t: 2 },
    { say: 'Crack, wait, breathe.', do: 'Fry the eggs until the whites set.', tell: "Crack the eggs gently into the pan. And then, just wait. Breathe. Watch the whites turn from clear to white, slowly, from the edges in. About four minutes. If you like a crispy edge, turn the heat up for the last thirty seconds.", t: 4 },
    { say: 'Something green, something golden.', do: 'Plate with greens and toast.', tell: "Toast your sourdough until it's deep gold. Pile a handful of greens on the plate, slide the eggs on top, and add a pinch of chilli. Something green, something golden. Sit by the window if you can. This ten minutes is yours.", t: 2 },
  ] },
  { id: 'noodles', title: 'Noodles for a **lonely Tuesday**', real: 'Miso noodle soup', dish: { src: U('1631709497146-a239ef373cf1'), pos: '50% 50%', zoom: 1.15 }, photo: U('1631709497146-a239ef373cf1'), tint: C.peri, mood: 'Lonely', mins: 15, level: 'Easy', serves: 1, by: 'Leo', avatar: '/r2a/photo-3.jpg', standfirst: 'For the nights the flat is too quiet.', story: 'My flatmates all went home for the weekend. I made this, put a podcast on, and ate it slowly so the quiet felt chosen instead of given.', ing: [['1 nest', 'Noodles'], ['1 tbsp', 'Miso paste'], ['1', 'Egg'], ['2', 'Spring onions'], ['A handful', 'Spinach']], cooked: 690, rating: 5, reviews: [['Maya', 'The podcast tip is everything.'], ['Jack', 'Quiet, but the good kind.']], steps: [
    { say: 'Put the kettle on. Company is optional.', do: 'Soft-boil the egg for six and a half minutes.', tell: "The flat was too quiet that weekend, so I made some noise in the kitchen. Put a small pan of water on to boil. Lower the egg in gently, and set a timer for six and a half minutes. Then straight into cold water. That's your jammy middle sorted.", t: 7 },
    { say: 'Miso dissolves like a bad mood.', do: 'Whisk miso into hot water, add the noodles.', tell: "Boil the kettle and pour about two mugs of water into a pot. Stir in the miso until it's cloudy and smells like comfort. Drop the noodles in, and the spinach after them. Three minutes. Watch the spinach go soft and give up.", t: 3 },
    { say: 'Eat it slowly. The quiet is yours now.', do: 'Top with egg and spring onion.', tell: "Pour it all into your biggest bowl. Peel the egg, halve it, and lay it on top. Scatter over the spring onions. Put something on to listen to, and eat it slowly. Tonight the quiet isn't lonely. It's yours.", t: 2 },
  ] },
  { id: 'oats', title: 'Porridge for **5 hours of sleep**', real: 'Banana and berry porridge', dish: { src: U('1504712598893-24159a89200e'), pos: '50% 50%', zoom: 1.2 }, photo: U('1504712598893-24159a89200e'), tint: C.butter, mood: 'Tired', mins: 8, level: 'Easy', serves: 1, by: 'Aoife', avatar: '/r2a/photo-2.jpg', standfirst: 'One pot, one spoon, no decisions.', story: 'First month of my first job, I was asleep on my feet. Porridge was the only breakfast I could make with my eyes half closed. It got me to every 9am.', ing: [['½ cup', 'Oats'], ['1 cup', 'Milk'], ['1', 'Banana'], ['A handful', 'Berries'], ['1 tsp', 'Honey']], cooked: 945, rating: 4, reviews: [['Leo', 'Made it to the 9am.'], ['Niamh', 'Zero decisions, as promised.']], steps: [
    { say: 'Zero decisions. Oats, milk, heat.', do: 'Simmer oats and milk, stirring.', tell: "You don't have to be awake for this. Tip the oats and milk into a small pot, and put it on a medium heat. Stir it every now and then while you find your keys. About five minutes, until it's thick and creamy.", t: 5 },
    { say: 'Mash the banana. Take it out on the banana.', do: 'Stir in half the banana.', tell: "Mash half the banana with a fork, right on the chopping board. Take it out on the banana if you need to. Stir it into the porridge. It makes it sweet, so you don't need much else.", t: 1 },
    { say: 'Something bright on top. You made it to Tuesday.', do: 'Top with berries, banana and honey.', tell: "Spoon it into a bowl. Slice the rest of the banana over the top, add the berries and a drizzle of honey. Something bright, for a grey morning. Eat it while you're still in your socks. You made it.", t: 2 },
  ] },
  { id: 'dal', title: 'Dal for when you **did it yourself**', real: 'Red lentil dal with rice', dish: { src: U('1596560314766-08c0c6890024'), pos: '50% 50%', zoom: 1.15 }, photo: U('1596560314766-08c0c6890024'), tint: C.peach, mood: 'Proud', mins: 25, level: 'Medium', serves: 3, by: 'Priya', avatar: '/r2a/street-1.jpg', standfirst: 'The first meal you cook that feeds more than just you.', story: 'The first time I paid all my own bills, I made my grandmother\u2019s dal for my flatmates. Nobody knew why I was so emotional over lentils.', ing: [['1 cup', 'Red lentils'], ['1', 'Onion'], ['1 tin', 'Coconut milk'], ['2 tsp', 'Curry powder'], ['1 cup', 'Rice']], cooked: 577, rating: 5, reviews: [['Saoirse', 'Flatmates asked for seconds.'], ['Mary', 'Proud of you, love.']], steps: [
    { say: 'Start the rice. Future you says thanks.', do: 'Cook the rice.', tell: "Rinse the rice until the water runs clear, then put it on with twice as much water. Lid on, low heat. Now you can forget about it. Future you says thanks.", t: 12 },
    { say: 'Onion and spice. The flat smells like a grandmother.', do: 'Soften the onion, then add the curry powder.', tell: "In a big pan, soften the onion in a little oil until it's golden and sweet. Sprinkle in the curry powder and stir for a minute. Smell that? That's the moment the flat stops smelling like a flat, and starts smelling like someone's home.", t: 5 },
    { say: 'Lentils go in. They do the hard work.', do: 'Add lentils, coconut milk and a mug of water.', tell: "Rinse the lentils and tip them in, then the coconut milk and a mug of water. Bring it to a bubble, then turn it down. Stir now and then. In about fifteen minutes, the lentils will melt into something thick and golden. They do the hard work.", t: 15 },
    { say: 'Set the table. Call them in.', do: 'Season and serve over rice.', tell: "Taste, and add salt until it sings. Spoon the rice into bowls, ladle the dal over the top. Now set the table properly, and call everyone in. You did this yourself. Let them see it.", t: 2 },
  ] },
]
const RANKED = [...RECIPES].sort((a, b) => b.cooked - a.cooked)
export type Screen = 'home' | 'recipes' | 'cook' | 'bento' | 'wall' | 'rank'

const TopBar = ({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) => <div className="flex h-9 items-center justify-between px-4 pt-12">{left ?? <span />}{right ?? <span style={{ color: C.ink }}><Ico d={I.search} /></span>}</div>

/* ---------- HOME ---------- */
function Home({ go, open }: { go: (s: Screen) => void; open: (id: string) => void }) {
  const hero = RECIPES[2]
  return (
    <div className="pb-28">
      <TopBar left={<span />} />
      <div className="px-4 pt-6"><T text="Good **evening**, Aoife" size={32} /></div>

      {/* hero story: plate bleeds off the card edge */}
      <button onClick={() => open(hero.id)} className="relative mx-4 mt-8 block h-[340px] w-[calc(100%-32px)] overflow-visible rounded-[32px] text-left" style={{ background: C.violet, boxShadow: '0 30px 50px -28px rgba(74,68,112,.6)' }}>
        <Plate d={hero.dish} size={172} className="absolute -right-8 -top-8" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: C.sun, color: C.ink }}>Story of the week</span>
          <T text={hero.title} size={28} className="mt-4" light="#fff" />
          <p className="mt-2 w-[85%] text-[13px] leading-relaxed text-white/80">{hero.standfirst} By {hero.by}.</p>
        </div>
      </button>

      {/* today's bento */}
      <section className="mt-12 px-4">
        <div className="flex items-center justify-between"><T text="Today's **bento**" size={22} /><button onClick={() => go('bento')} className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/80 py-1.5 pl-3.5 pr-2.5 text-[12px] font-semibold transition active:scale-95" style={{ color: C.ink, boxShadow: '0 6px 14px -8px rgba(28,26,43,.35)' }}>Compose<Ico d={<path d="M9 6l6 6-6 6" />} size={13} w={2.2} /></button></div>
        <button onClick={() => go('bento')} className="relative mt-6 flex h-[132px] w-full items-center rounded-[28px] pl-[132px] pr-6 text-left" style={{ background: C.mint2, boxShadow: CARD_SHADOW }}>
          <Plate d={{ src: U('1594955332421-2033cfd867b4', 400), zoom: 1.3 }} size={124} className="absolute -left-2 -top-4" />
          <span><span className="block text-[15px] font-medium">Rice, greens, one soft egg</span><Meta className="mt-1">Jack's Monday box · 31 saves</Meta></span>
        </button>
      </section>

      {/* community story */}
      <section className="mt-12 px-4">
        <div className="flex items-center justify-between"><T text="From the **diary**" size={22} /><button onClick={() => go('wall')} className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/80 py-1.5 pl-3.5 pr-2.5 text-[12px] font-semibold transition active:scale-95" style={{ color: C.ink, boxShadow: '0 6px 14px -8px rgba(28,26,43,.35)' }}>See all<Ico d={<path d="M9 6l6 6-6 6" />} size={13} w={2.2} /></button></div>
        <button onClick={() => go('wall')} className="mt-6 block w-full overflow-hidden rounded-[28px] p-2 text-left" style={{ background: C.glass, boxShadow: CARD_SHADOW }}>
          <img src="/r2a/photo-4.jpg" alt="Two friends with the cookbook" className="aspect-[16/10] w-full rounded-[22px] object-cover" />
          <div className="flex items-center gap-4 p-4"><img src="/r2a/photo-4.jpg" alt="" className="h-9 w-9 rounded-full object-cover" /><div className="flex-1"><p className="text-[15px] font-medium leading-snug">"We cooked it together and it actually worked."</p><Meta className="mt-1">Saoirse & Cian · 2h</Meta></div></div>
        </button>
      </section>

      {/* ranking preview */}
      <section className="mt-12">
        <div className="flex items-center justify-between px-4"><T text="Comfort, **ranked**" size={22} /><button onClick={() => go('rank')} className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-white/80 py-1.5 pl-3.5 pr-2.5 text-[12px] font-semibold transition active:scale-95" style={{ color: C.ink, boxShadow: '0 6px 14px -8px rgba(28,26,43,.35)' }}>Full list<Ico d={<path d="M9 6l6 6-6 6" />} size={13} w={2.2} /></button></div>
        <div className="mt-6 flex gap-4 overflow-x-auto px-4 pb-8 pt-12 [scrollbar-width:none]">
          {RANKED.slice(0, 3).map((r, i) => (
            <button key={r.id} onClick={() => open(r.id)} className="relative h-[172px] w-[148px] shrink-0 rounded-[26px] px-4 pb-4 text-left" style={{ background: r.tint, boxShadow: CARD_SHADOW }}>
              <Plate d={r.dish} size={100} className="absolute -right-3 -top-10" />
              <span className="absolute left-4 top-3 text-[40px] font-semibold leading-none" style={{ ...SERIF, color: C.ink }}>{i + 1}</span>
              <div className="absolute inset-x-4 bottom-4"><T text={r.title} size={15} /><p className="mt-1 text-[12px] text-[#1c1a2b]/75">{r.cooked.toLocaleString()} cooked</p></div>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

/* ---------- STORIES: mood pills + card carousel ---------- */
function Stories({ open, saved, toggle }: { open: (id: string) => void; saved: string[]; toggle: (id: string) => void }) {
  const moods = ['All', 'Homesick', 'Broke', 'Restless', 'Calm', 'Lonely', 'Tired', 'Proud']
  const [m, setM] = useState('All')
  const list = RECIPES.filter((r) => m === 'All' || r.mood === m)
  return (
    <div className="pb-28">
      <TopBar />
      <T text="Recipe **stories**" size={32} className="px-4 pt-6" />
      <div className="mt-5 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
        {moods.map((x) => <button key={x} onClick={() => setM(x)} className="shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition active:scale-95" style={m === x ? { background: C.ink, color: '#fff' } : { background: 'rgba(255,255,255,.7)', color: C.ink }}>{x}</button>)}
      </div>
      <div className="mt-4 flex">
        <div className="flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-8 pt-12 [scrollbar-width:none]">
          {list.map((r, i) => (
            <div key={r.id} className="relative h-[330px] w-[214px] shrink-0 snap-start rounded-[30px] text-left" style={{ background: r.tint, boxShadow: CARD_SHADOW, animation: `v7-in 450ms ${i * 70}ms both` }}>
              <button onClick={() => toggle(r.id)} aria-label="Save" className="absolute left-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-2xl text-white transition active:scale-90" style={{ background: C.coral, boxShadow: '0 12px 20px -8px rgba(255,122,92,.7)' }}><Ico d={I.heart} size={18} fill={saved.includes(r.id) ? '#fff' : 'none'} w={2} /></button>
              <button onClick={() => open(r.id)} className="block h-full w-full text-left">
                <Plate d={r.dish} size={164} className="absolute -right-4 -top-10" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-block rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold">{r.mood} · {r.mins} min</span>
                  <T text={r.title} size={24} className="mt-2" />
                  <p className="mt-2 text-[12px] leading-relaxed text-[#1c1a2b]/70">{r.standfirst}</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- RECIPE DETAIL + COOKING ---------- */
// scale a quantity like '4', '1 L', '½', '200 g' or 'A handful' by k
const FR: Record<string, number> = { '½': 0.5, '¼': 0.25, '¾': 0.75 }
const fmtN = (n: number) => { const r = Math.round(n * 4) / 4; const w = Math.floor(r); const f = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[r - w] ?? ''; return w ? `${w}${f}` : f || '0' }
function scaleQty(q: string, k: number) {
  if (k === 1) return q
  const m = q.match(/^(\d+(?:\.\d+)?|[½¼¾])\s*(.*)$/)
  if (!m) return `${q} ×${fmtN(k)}`
  const n = FR[m[1]] ?? parseFloat(m[1])
  const big = /^(g|ml)$/.test(m[2])
  return `${big ? Math.round(n * k) : fmtN(n * k)}${m[2] ? ' ' + m[2] : ''}`
}
const Stepper = ({ v, set, min = 1, max = 8 }: { v: number; set: (n: number) => void; min?: number; max?: number }) => (
  <div className="flex items-center gap-1 rounded-full bg-white p-1" style={{ boxShadow: '0 6px 14px -8px rgba(28,26,43,.35)' }}>
    <button onClick={() => set(Math.max(min, v - 1))} disabled={v <= min} aria-label="Fewer servings" className="grid h-8 w-8 place-items-center rounded-full text-[18px] transition active:scale-90 disabled:opacity-30" style={{ background: C.bg }}>−</button>
    <span className="w-16 text-center text-[13px] font-semibold">{v} {v === 1 ? 'person' : 'people'}</span>
    <button onClick={() => set(Math.min(max, v + 1))} disabled={v >= max} aria-label="More servings" className="grid h-8 w-8 place-items-center rounded-full text-white transition active:scale-90 disabled:opacity-30" style={{ background: C.ink }}><Ico d={I.plus} size={14} w={2.2} /></button>
  </div>
)

function Cook({ id, go, saved, toggle }: { id: string; go: (s: Screen) => void; saved: string[]; toggle: (id: string) => void }) {
  const r = RECIPES.find((x) => x.id === id) ?? RECIPES[0]
  const [step, setStep] = useState(-1)
  const [left, setLeft] = useState(0)
  const [playing, setPlaying] = useState(true) // visual-only narration indicator, no audio
  const [rate, setRate] = useState(0)
  const [serves, setServes] = useState(r.serves)
  const [got, setGot] = useState<string[]>([])
  const k = serves / r.serves
  const ready = got.length === r.ing.length
  const used = (txt: string) => r.ing.filter(([, n]) => txt.toLowerCase().includes(n.toLowerCase().replace(/s$/, '').split(' ').pop()!))
  const done = step >= r.steps.length
  useEffect(() => { if (step < 0 || done) return; setLeft(1); const t = setInterval(() => setLeft((v) => Math.max(0, v - 0.01)), 100); return () => clearInterval(t) }, [step, done])
  const back = (fn: () => void) => <button onClick={fn} aria-label="Back" style={{ color: C.ink }}><Ico d={I.back} size={22} /></button>

  if (step < 0) return (
    <div className="relative min-h-full" style={{ background: r.tint }}>
      <TopBar left={back(() => go('recipes'))} />
      <div className="relative h-[290px]">
        <T text={r.title} size={28} className="relative z-10 w-[56%] px-4 pt-6" />
        <div className="relative z-10 mt-8 space-y-4 px-4">{[[I.clock, `${r.mins} mins`], [I.people, `${serves} ${serves === 1 ? 'person' : 'people'}`], [I.flame, r.level]].map(([d, l], i) => <p key={i} className="flex items-center gap-2 text-[12px] font-medium" style={{ color: '#5d5a6e' }}><span style={{ color: C.coral }}><Ico d={d} size={16} /></span>{l as string}</p>)}</div>
        <Plate d={r.dish} size={210} className="absolute -right-24 top-10" />
      </div>
      <div className="relative -mt-2 rounded-t-[32px] bg-white px-6 pb-28 pt-4" style={{ boxShadow: '0 -20px 40px -30px rgba(60,48,120,.4)' }}>
        <div className="mx-auto h-1 w-10 rounded-full bg-[#e6e3ee]" />
        <div className="mt-6 flex items-center gap-2"><img src={r.avatar} alt={r.by} className="h-8 w-8 rounded-full object-cover" /><Meta>A story by <span className="font-medium" style={{ color: C.ink }}>{r.by}</span></Meta></div>
        <p className="mt-4 text-[15px] leading-[1.65]">{r.story}</p>
        <div className="mt-8 flex items-center justify-between"><T text="What you'll **need**" size={22} /><Stepper v={serves} set={setServes} /></div>
        <div className="mt-3 flex items-center justify-between text-[12px]" style={{ color: C.mute }}>
          <span>{got.length} of {r.ing.length} gathered</span>
          <button onClick={() => setGot(ready ? [] : r.ing.map(([, n]) => n))} className="font-semibold" style={{ color: C.ink }}>{ready ? 'Clear' : 'Tick all'}</button>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full" style={{ background: C.bg }}><div className="h-full rounded-full transition-all duration-500" style={{ width: `${(got.length / r.ing.length) * 100}%`, background: C.coral }} /></div>
        <ul className="mt-4 space-y-2">{r.ing.map(([q, n]) => { const on = got.includes(n); return (
          <li key={n}><button onClick={() => setGot((g) => (on ? g.filter((x) => x !== n) : [...g, n]))} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[14px] transition active:scale-[.98]" style={{ background: on ? r.tint : C.bg }}>
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full transition" style={on ? { background: C.ink, color: '#fff' } : { background: '#fff', boxShadow: 'inset 0 0 0 1.5px rgba(28,26,43,.25)' }}>{on && <Ico d={<path d="M5 12l5 5 9-10" />} size={12} w={2.6} />}</span>
            <span className={`flex-1 transition ${on ? 'line-through opacity-60' : ''}`}>{n}</span>
            <span className="font-semibold tabular-nums">{scaleQty(q, k)}</span>
          </button></li>) })}</ul>
        {ready && <p className="mt-4 rounded-2xl p-4 text-[14px] leading-relaxed" style={{ background: r.tint, ...SERIF }}>"Everything's on the counter. Good. Now let me tell you how it goes." <span className="text-[12px]" style={{ fontFamily: 'inherit', color: C.mute }}>— {r.by}</span></p>}
        <p className="mt-8 text-[15px] font-semibold">{r.cooked} people cooked this</p>
        <div className="mt-4 space-y-2">{r.reviews.map(([n, q]) => <div key={n} className="rounded-2xl p-4" style={{ background: C.bg }}><p className="text-[14px]">"{q}"</p><Meta className="mt-1">{n}</Meta></div>)}</div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 flex gap-2 px-4 pb-4 pt-6" style={{ background: 'linear-gradient(to top, #fff 60%, transparent)' }}>
        <IconBtn d={I.heart} label="Save" on={saved.includes(r.id)} onClick={() => toggle(r.id)} />
        <Pill onClick={() => setStep(0)}>{ready ? `Begin ${r.by}'s story` : `Cook with ${r.by} · ${got.length}/${r.ing.length} ready`}</Pill>
      </div>
    </div>
  )

  if (done) return (
    <div className="min-h-full px-4 pb-28 text-center" style={{ background: r.tint }}>
      <TopBar left={back(() => setStep(r.steps.length - 1))} right={<span />} />
      <Plate d={r.dish} size={200} className="mx-auto mt-8" />
      <T text="You **made** that." size={34} className="mt-8" />
      <Meta className="mt-2">Added to your diary</Meta>
      <div className="mt-6 flex justify-center gap-2">{[1, 2, 3, 4, 5].map((i) => <button key={i} onClick={() => setRate(i)} aria-label={`${i} stars`} style={{ color: i <= rate ? C.coral : '#c9c5d6' }}><Ico d={<path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.4 6-5.5-3.3-5.5 3.3 1.4-6L3.3 9.2l6.1-.6z" />} size={28} fill={i <= rate ? C.coral : 'none'} /></button>)}</div>
      <div className="mt-8 flex"><Pill onClick={() => go('wall')}>Share to diary</Pill></div>
    </div>
  )

  const s = r.steps[step]
  const mins = Math.ceil(s.t * left)
  const these = used(s.do)
  return (
    <div className="flex min-h-full flex-col px-4 pb-28" style={{ background: r.tint }}>
      <TopBar left={back(() => setStep(step - 1))} right={<span className="text-[12px] font-semibold" style={{ color: C.ink }}>{serves} {serves === 1 ? 'person' : 'people'}</span>} />
      {/* story-style chapter progress */}
      <div className="mt-4 flex gap-1">{r.steps.map((_, i) => <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/60"><div className="h-full rounded-full" style={{ background: C.ink, width: i < step ? '100%' : i === step ? `${(1 - left) * 100}%` : '0%' }} /></div>)}</div>
      <div key={step} style={{ animation: 'v7-in 450ms both' }}>
        <div className="mt-6 flex items-center gap-3">
          <img src={r.avatar} alt={r.by} className="h-10 w-10 rounded-full border-2 border-white object-cover" />
          <div className="flex-1"><p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.mute }}>Chapter {step + 1} of {r.steps.length}</p><p className="text-[13px] font-medium">{r.by} remembers</p></div>
          <button onClick={() => setPlaying((v) => !v)} aria-label={playing ? 'Pause narration' : 'Play narration'} className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-3 pr-1.5">
            <span className="flex h-3 items-center gap-[2px]">{Array.from({ length: 10 }, (_, i) => <span key={i} className="w-[2px] origin-center rounded-full" style={{ background: C.ink, height: 4 + ((i * 5) % 9), animation: playing ? `v7-eq ${0.8 + (i % 4) * 0.15}s ${(i % 6) * 0.1}s ease-in-out infinite` : 'none', opacity: playing ? 1 : 0.4 }} />)}</span>
            <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: C.ink, color: '#fff' }}><Ico d={playing ? I.pause : I.play} size={12} w={2.2} /></span>
          </button>
        </div>
        <p className="mt-6 text-[26px] leading-[1.25]" style={SERIF}>"{s.say}"</p>
        {s.tell && <p className="mt-4 text-[15px] leading-[1.7]">{s.tell}</p>}
        <div className="relative mt-8 rounded-[28px] bg-white p-5" style={{ boxShadow: CARD_SHADOW }}>
          <div className="absolute -top-8 right-4 grid h-[92px] w-[92px] place-items-center">
            <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90"><circle cx="50" cy="50" r="46" fill="none" stroke="#fff" strokeWidth="6" /><circle cx="50" cy="50" r="46" fill="none" stroke={C.coral} strokeWidth="6" strokeLinecap="round" strokeDasharray="289" strokeDashoffset={289 * (1 - left)} /></svg>
            <Plate d={r.dish} size={76} />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.mute }}>What to do</p>
          <p className="mt-2 w-[68%] text-[18px] font-semibold leading-snug">{s.do}</p>
          <p className="mt-3 text-[13px] font-medium" style={{ color: C.coral }}>{mins > 0 ? `About ${mins} min` : 'Done when it looks right'}</p>
          {these.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{these.map(([q, n]) => <span key={n} className="rounded-full px-3 py-1 text-[12px] font-medium" style={{ background: r.tint }}>{scaleQty(q, k)} {n.toLowerCase()}</span>)}</div>}
        </div>
        {step > 0 && <p className="mt-6 text-[13px] leading-relaxed" style={{ color: C.mute }}>Before this: {r.steps[step - 1].do.toLowerCase()}</p>}
      </div>
      <div className="mt-auto flex pt-8"><Pill onClick={() => setStep(step + 1)}>{step < r.steps.length - 1 ? `Chapter ${step + 2}` : 'The ending'}</Pill></div>
    </div>
  )
}

/* ---------- RANKING ---------- */
function Ranking({ open, go }: { open: (id: string) => void; go: (s: Screen) => void }) {
  const [first, ...rest] = RANKED
  return (
    <div className="pb-28">
      <TopBar left={<button onClick={() => go('home')} aria-label="Back"><Ico d={I.back} size={22} /></button>} />
      <div className="px-4 pt-6"><Meta>Most cooked this winter</Meta><T text="Winter comfort, **ranked**" size={32} className="mt-2" /></div>
      <button onClick={() => open(first.id)} className="relative mx-4 mt-12 block h-[300px] w-[calc(100%-32px)] rounded-[32px] text-left" style={{ background: first.tint, boxShadow: CARD_SHADOW }}>
        <span className="absolute left-6 top-4 text-[88px] font-semibold leading-none" style={{ ...SERIF, color: C.ink }}>1</span>
        <Plate d={first.dish} size={150} className="absolute -right-6 -top-10" />
        <div className="absolute inset-x-0 bottom-0 p-6"><T text={first.title} size={26} /><Meta className="mt-2">{first.cooked.toLocaleString()} cooked · by {first.by}</Meta></div>
      </button>
      <div className="mt-12 space-y-6 px-4">
        {rest.map((r, i) => (
          <button key={r.id} onClick={() => open(r.id)} className="relative flex h-[104px] w-full items-center rounded-[26px] pl-6 pr-[112px] text-left" style={{ background: C.glass, boxShadow: CARD_SHADOW, animation: `v7-in 450ms ${i * 80}ms both` }}>
            <span className="w-10 shrink-0 text-[28px] font-semibold leading-none tabular-nums tracking-[-0.03em]" style={{ color: C.periDeep }}>{i + 2}</span>
            <span className="min-w-0 flex-1"><p className="line-clamp-2 text-[15px] font-semibold leading-[1.25] tracking-[-0.01em]" style={{ color: C.ink }}>{r.title.replace(/\*\*/g, '')}</p><Meta className="mt-1">{r.cooked.toLocaleString()} cooked</Meta></span>
            <Plate d={r.dish} size={104} className="absolute -right-2 top-0" />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- BENTO (drag and drop) ---------- */
type Slot = 'Carbs' | 'Protein' | 'Fibre' | 'Fats'
const SLOTS: { s: Slot; label: string; tint: string; hint: string }[] = [
  { s: 'Carbs', label: 'Carbs', tint: C.sun, hint: 'Slow energy that keeps you full' },
  { s: 'Protein', label: 'Protein', tint: C.apricot, hint: 'Aim for about 25 g a meal' },
  { s: 'Fibre', label: 'Fibre & veg', tint: C.mint2, hint: 'Colour, crunch and gut health' },
  { s: 'Fats', label: 'Fats & flavour', tint: C.lilac, hint: 'The bit that makes it taste good' },
]
type Item = { n: string; slot: Slot; d?: Dish; tags: string[]; p: number; f: number; kcal: number; mins: number; prep: string }
const PANTRY: Item[] = [
  { n: 'Rice', slot: 'Carbs', d: { src: U('1520066391310-428f06ebd602', 200), zoom: 1.4 }, tags: ['Gluten free', 'Cheap'], p: 4, f: 1, kcal: 200, mins: 15, prep: 'Rinse 1 cup of rice and simmer, covered, for 12 minutes. Rest it with the lid on.' },
  { n: 'Noodles', slot: 'Carbs', d: { src: U('1704915912468-4b738ca2ca73', 200), zoom: 1.6 }, tags: ['Quick'], p: 6, f: 2, kcal: 220, mins: 5, prep: 'Boil the noodles for 4 minutes, drain and toss with a splash of soy.' },
  { n: 'Sweet potato', slot: 'Carbs', tags: ['High fibre', 'Vitamin A'], p: 2, f: 4, kcal: 110, mins: 25, prep: 'Cube the sweet potato and roast at 200°C for 25 minutes with oil and salt.' },
  { n: 'Sourdough', slot: 'Carbs', tags: ['Quick'], p: 5, f: 2, kcal: 180, mins: 3, prep: 'Toast two slices until deeply golden.' },
  { n: 'Egg', slot: 'Protein', d: { src: U('1691480184494-d9f822edd4d1', 200), zoom: 1.2 }, tags: ['6 g each', 'Cheap'], p: 12, f: 0, kcal: 150, mins: 7, prep: 'Soft-boil two eggs for 7 minutes, then cool them in cold water and peel.' },
  { n: 'Chicken', slot: 'Protein', d: { src: U('1788090485545-26c4d90f9c9f', 200), zoom: 1.6 }, tags: ['Lean', 'Filling'], p: 28, f: 0, kcal: 190, mins: 12, prep: 'Season the chicken thigh and pan-fry for 6 minutes a side. Rest it, then slice.' },
  { n: 'Tofu', slot: 'Protein', tags: ['Plant based', 'Iron'], p: 16, f: 2, kcal: 140, mins: 10, prep: 'Press and cube the tofu, then fry until crisp on every side.' },
  { n: 'Chickpeas', slot: 'Protein', tags: ['Plant based', 'High fibre'], p: 9, f: 7, kcal: 160, mins: 2, prep: 'Drain and rinse half a tin. Warm them with cumin if you like.' },
  { n: 'Greens', slot: 'Fibre', d: { src: U('1626711934535-9749ea30dba8', 200), zoom: 1.5 }, tags: ['Iron', 'Folate'], p: 3, f: 3, kcal: 30, mins: 3, prep: 'Wilt a big handful of spinach or kale in the hot pan for a minute.' },
  { n: 'Salad', slot: 'Fibre', d: { src: U('1604259597308-5321e8e4789c', 200), zoom: 1.4 }, tags: ['Raw', 'Crunch'], p: 2, f: 3, kcal: 40, mins: 4, prep: 'Slice cucumber, tomato and leaves. Dress with lemon and salt.' },
  { n: 'Broccoli', slot: 'Fibre', tags: ['Vitamin C', 'High fibre'], p: 3, f: 5, kcal: 50, mins: 5, prep: 'Steam the florets for 4 minutes so they stay bright green.' },
  { n: 'Carrots', slot: 'Fibre', tags: ['Vitamin A', 'Cheap'], p: 1, f: 3, kcal: 40, mins: 2, prep: 'Grate one carrot, or cut it into thin ribbons.' },
  { n: 'Avocado', slot: 'Fats', d: { src: U('1611255153959-5d090dc09ac0', 200), zoom: 1.5 }, tags: ['Good fats', 'Fibre'], p: 2, f: 5, kcal: 160, mins: 1, prep: 'Halve the avocado, slice it and add a pinch of salt.' },
  { n: 'Chilli oil', slot: 'Fats', tags: ['Flavour'], p: 0, f: 0, kcal: 90, mins: 0, prep: 'Spoon chilli oil over the top at the very end.' },
  { n: 'Sesame', slot: 'Fats', tags: ['Calcium', 'Crunch'], p: 2, f: 1, kcal: 50, mins: 2, prep: 'Toast a tablespoon of sesame seeds in a dry pan until fragrant.' },
  { n: 'Yoghurt sauce', slot: 'Fats', tags: ['Protein', 'Cooling'], p: 5, f: 0, kcal: 70, mins: 2, prep: 'Stir yoghurt with lemon, garlic and salt.' },
]
const TARGET = { p: 25, f: 8 }
// extra nutrients per portion: carbs g, fat g, iron mg, calcium mg, vitamin C mg
type Nut = { c: number; fat: number; fe: number; ca: number; vc: number }
const NUT: Record<string, Nut> = {
  Rice: { c: 45, fat: 0.5, fe: 0.4, ca: 10, vc: 0 }, Noodles: { c: 43, fat: 2, fe: 1, ca: 15, vc: 0 }, 'Sweet potato': { c: 26, fat: 0, fe: 0.8, ca: 40, vc: 3 }, Sourdough: { c: 34, fat: 1.5, fe: 2, ca: 30, vc: 0 },
  Egg: { c: 1, fat: 10, fe: 1.8, ca: 56, vc: 0 }, Chicken: { c: 0, fat: 9, fe: 1.3, ca: 15, vc: 0 }, Tofu: { c: 3, fat: 8, fe: 3, ca: 350, vc: 0 }, Chickpeas: { c: 22, fat: 2.5, fe: 2.4, ca: 40, vc: 1 },
  Greens: { c: 4, fat: 0.5, fe: 2.7, ca: 100, vc: 28 }, Salad: { c: 7, fat: 0.3, fe: 0.6, ca: 30, vc: 15 }, Broccoli: { c: 7, fat: 0.4, fe: 0.7, ca: 47, vc: 80 }, Carrots: { c: 10, fat: 0.2, fe: 0.3, ca: 33, vc: 6 },
  Avocado: { c: 9, fat: 15, fe: 0.6, ca: 12, vc: 10 }, 'Chilli oil': { c: 0, fat: 10, fe: 0, ca: 0, vc: 0 }, Sesame: { c: 2, fat: 5, fe: 1.3, ca: 88, vc: 0 }, 'Yoghurt sauce': { c: 5, fat: 3, fe: 0.1, ca: 150, vc: 1 },
}
// roughly a third of an adult's daily needs, i.e. one meal
const NUTS: { k: 'p' | 'f' | keyof Nut; label: string; max: number; unit: string; color: string; why: string }[] = [
  { k: 'p', label: 'Protein', max: 25, unit: 'g', color: '#e9866b', why: 'muscle and staying full' },
  { k: 'c', label: 'Carbs', max: 60, unit: 'g', color: '#d9b44a', why: 'energy' },
  { k: 'f', label: 'Fibre', max: 8, unit: 'g', color: '#5fae7f', why: 'digestion' },
  { k: 'fat', label: 'Fat', max: 20, unit: 'g', color: '#9a8ad6', why: 'vitamin absorption' },
  { k: 'fe', label: 'Iron', max: 5, unit: 'mg', color: '#b0625a', why: 'beating tiredness' },
  { k: 'ca', label: 'Calcium', max: 330, unit: 'mg', color: '#6f8fb8', why: 'bones' },
  { k: 'vc', label: 'Vitamin C', max: 30, unit: 'mg', color: '#e0a03c', why: 'immunity and iron uptake' },
]
const val = (x: Item, k: (typeof NUTS)[number]['k']) => (k === 'p' ? x.p : k === 'f' ? x.f : NUT[x.n][k])

const Bubble = ({ it, size }: { it: Item; size: number }) => it.d ? <Plate d={it.d} size={size} /> : (
  <div className="grid shrink-0 place-items-center rounded-full border-[3px] border-white" style={{ width: size, height: size, background: SLOTS.find((x) => x.s === it.slot)!.tint, boxShadow: '0 10px 18px -10px rgba(28,26,43,.4)' }}>
    <span className="font-semibold" style={{ ...SERIF, fontSize: size * 0.4 }}>{it.n[0]}</span>
  </div>
)

const Bar = ({ label, v, max, color, unit = 'g' }: { label: string; v: number; max: number; color: string; unit?: string }) => (
  <div>
    <div className="flex justify-between text-[12px]"><span className="font-medium">{label}</span><span className="text-[#1c1a2b]/75">{Math.round(v * 10) / 10} / {max} {unit}</span></div>
    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/70"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (v / max) * 100)}%`, background: color }} /></div>
  </div>
)

function Bento({ go }: { go: (s: Screen) => void }) {
  const [pick, setPick] = useState<number[]>([0, 8])
  const [tab, setTab] = useState<Slot>('Protein')
  const items = pick.map((i) => PANTRY[i])
  const has = (s: Slot) => items.some((x) => x.slot === s)
  const toggle = (i: number) => setPick((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))
  const tot = items.reduce((a, x) => ({ p: a.p + x.p, f: a.f + x.f, kcal: a.kcal + x.kcal }), { p: 0, f: 0, kcal: 0 })
  const done = SLOTS.filter((x) => has(x.s)).length

  // recommendations: missing groups first, then shortfalls
  const recs: { why: string; i: number }[] = []
  const best = (slot: Slot | null, key: 'p' | 'f') => PANTRY.map((x, i) => ({ x, i })).filter(({ x, i }) => !pick.includes(i) && (!slot || x.slot === slot)).sort((a, b) => b.x[key] - a.x[key])[0]
  if (!has('Protein')) { const b = best('Protein', 'p'); if (b) recs.push({ why: `No protein yet. Add ${b.x.n.toLowerCase()} for ${b.x.p} g`, i: b.i }) }
  else if (tot.p < TARGET.p) { const b = best(null, 'p'); if (b) recs.push({ why: `${TARGET.p - tot.p} g short on protein. ${b.x.n} adds ${b.x.p} g`, i: b.i }) }
  if (!has('Fibre')) { const b = best('Fibre', 'f'); if (b) recs.push({ why: `Missing veg. ${b.x.n} adds ${b.x.f} g fibre`, i: b.i }) }
  else if (tot.f < TARGET.f) { const b = best(null, 'f'); if (b && !recs.some((r) => r.i === b.i)) recs.push({ why: `Fibre is low. ${b.x.n} adds ${b.x.f} g`, i: b.i }) }
  if (!has('Fats')) { const b = PANTRY.findIndex((x, i) => x.slot === 'Fats' && !pick.includes(i)); if (b >= 0) recs.push({ why: `Finish with ${PANTRY[b].n.toLowerCase()} for flavour`, i: b }) }
  if (!has('Carbs')) { const b = PANTRY.findIndex((x, i) => x.slot === 'Carbs' && !pick.includes(i)); if (b >= 0) recs.unshift({ why: `Needs a base. ${PANTRY[b].n} keeps you full`, i: b }) }
  const sum = (k: (typeof NUTS)[number]['k']) => items.reduce((a, x) => a + val(x, k), 0)
  for (const n of NUTS.filter((n) => !['p', 'f'].includes(n.k))) {
    if (recs.length >= 3 || sum(n.k) >= n.max * 0.6) continue
    const b = PANTRY.map((x, i) => ({ x, i })).filter(({ i }) => !pick.includes(i) && !recs.some((r) => r.i === i)).sort((a, c) => val(c.x, n.k) - val(a.x, n.k))[0]
    if (b && val(b.x, n.k) > 0) recs.push({ why: `Low on ${n.label.toLowerCase()} (for ${n.why}). ${b.x.n} adds ${val(b.x, n.k)} ${n.unit}`, i: b.i })
  }
  const balanced = done === 4 && tot.p >= TARGET.p && tot.f >= TARGET.f
  const verdict = balanced ? 'Perfectly **balanced**.' : done >= 3 ? 'Almost **there**.' : done ? 'A good **start**.' : 'Start with a **base**.'

  const steps = [...items].sort((a, b) => b.mins - a.mins)
  const total = steps[0]?.mins ?? 0

  return (
    <div className="relative pb-28">
      <TopBar right={<Meta>{done} of 4 groups</Meta>} />
      <T text="Build a **balanced** bowl" size={32} className="px-4 pt-6" />
      <Meta className="mt-2 px-4">Pick one from each group. We'll check the balance and show you how to put it together.</Meta>

      {/* 1. the bowl */}
      <div className="mx-4 mt-6 grid grid-cols-2 gap-2 rounded-[30px] bg-white p-2" style={{ boxShadow: CARD_SHADOW }}>
        {SLOTS.map(({ s, label, tint }) => {
          const here = items.filter((x) => x.slot === s)
          return (
            <button key={s} onClick={() => setTab(s)} className="relative flex h-[112px] flex-col items-start justify-start rounded-[22px] p-3 text-left transition" style={{ background: here.length ? tint : C.bg, boxShadow: tab === s ? `inset 0 0 0 2px ${C.ink}` : 'none' }}>
              <span className="text-[11px] font-semibold">{label}</span>
              {here.length ? (
                <div className="mt-2 flex -space-x-3">{here.slice(0, 3).map((x) => <Bubble key={x.n} it={x} size={48} />)}</div>
              ) : <p className="mt-3 text-[12px] text-[#1c1a2b]/70">+ Add</p>}
              {here.length > 0 && <span className="absolute bottom-3 right-3 max-w-[60%] truncate text-[11px] text-[#1c1a2b]/70">{here.map((x) => x.n).join(', ')}</span>}
            </button>
          )
        })}
      </div>

      {/* 2. balance check */}
      <div className="mx-4 mt-4 rounded-[28px] p-5" style={{ background: balanced ? C.mint2 : C.glass, boxShadow: CARD_SHADOW }}>
        <div className="flex items-baseline justify-between"><T text={verdict} size={22} /><span className="text-[12px] text-[#1c1a2b]/75">{tot.kcal} kcal</span></div>
        <div className="mt-4 space-y-3">
          {NUTS.map((n) => <Bar key={n.k} label={n.label} v={sum(n.k)} max={n.max} unit={n.unit} color={n.color} />)}
          <p className="text-[11px] text-[#1c1a2b]/75">Targets are about a third of an adult's daily needs, so one meal.</p>
        </div>
        {recs.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1c1a2b]/70">We recommend</p>
            {recs.slice(0, 3).map((r) => (
              <button key={r.i} onClick={() => toggle(r.i)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-2 pr-3 text-left transition active:scale-[.98]">
                <Bubble it={PANTRY[r.i]} size={36} />
                <span className="flex-1 text-[13px] leading-snug">{r.why}</span>
                <span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: C.ink }}><Ico d={I.plus} size={14} w={2.2} /></span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. browse by group with tags */}
      <div className="mt-8 px-4"><T text="Choose by **group**" size={22} /></div>
      <div className="mt-3 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none]">
        {SLOTS.map(({ s, label }) => <button key={s} onClick={() => setTab(s)} className="shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition" style={tab === s ? { background: C.ink, color: '#fff' } : { background: 'rgba(255,255,255,.7)' }}>{label}</button>)}
      </div>
      <Meta className="mt-3 px-4">{SLOTS.find((x) => x.s === tab)!.hint}</Meta>
      <div className="mt-3 space-y-2 px-4">
        {PANTRY.map((x, i) => ({ x, i })).filter(({ x }) => x.slot === tab).map(({ x, i }) => {
          const on = pick.includes(i)
          return (
            <button key={x.n} onClick={() => toggle(i)} className="flex w-full items-center gap-3 rounded-[22px] p-3 text-left transition active:scale-[.98]" style={{ background: on ? SLOTS.find((q) => q.s === x.slot)!.tint : C.glass }}>
              <Bubble it={x} size={54} />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold">{x.n}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium">{x.p} g protein</span>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium">{x.f} g fibre</span>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium">{NUT[x.n].c} g carbs</span>
                  {NUT[x.n].fe >= 1.5 && <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium">{NUT[x.n].fe} mg iron</span>}
                  {NUT[x.n].ca >= 80 && <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium">{NUT[x.n].ca} mg calcium</span>}
                  {NUT[x.n].vc >= 10 && <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium">{NUT[x.n].vc} mg vit C</span>}
                  {x.tags.map((t) => <span key={t} className="rounded-full px-2 py-0.5 text-[10px] text-[#1c1a2b]/70 ring-1 ring-[#1c1a2b]/10">{t}</span>)}
                </div>
              </div>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full transition" style={on ? { background: C.ink, color: '#fff' } : { background: '#fff' }}>{on ? <Ico d={<path d="M5 12l5 5 9-10" />} size={14} w={2.4} /> : <Ico d={I.plus} size={14} w={2.2} />}</span>
            </button>
          )
        })}
      </div>

      {/* 4. how to make it whole */}
      {items.length > 0 && (
        <div className="mx-4 mt-8 rounded-[28px] p-5" style={{ background: C.violet, color: '#fff', boxShadow: CARD_SHADOW }}>
          <div className="flex items-baseline justify-between"><T text="Put it **together**" size={22} light="#fff" /><span className="text-[12px] text-white/70">about {total} min</span></div>
          <p className="mt-1 text-[12px] text-white/70">Start the slowest thing first. Everything else fits around it.</p>
          <ol className="mt-4 space-y-3">
            {steps.map((x, k) => (
              <li key={x.n} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold" style={{ background: C.sun, color: C.ink }}>{k + 1}</span>
                <div><p className="text-[13px] font-semibold">{x.n}{x.mins > 0 && <span className="font-normal text-white/60"> · {x.mins} min</span>}</p><p className="text-[13px] leading-relaxed text-white/80">{x.prep}</p></div>
              </li>
            ))}
            <li className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold" style={{ background: C.sun, color: C.ink }}>{steps.length + 1}</span>
              <div><p className="text-[13px] font-semibold">Assemble</p><p className="text-[13px] leading-relaxed text-white/80">Base in the bowl first, then the veg on one side and the protein on the other. Add the fats and toppings last so they stay crisp.</p></div>
            </li>
          </ol>
        </div>
      )}

      <div className="flex px-4 pt-6"><Pill onClick={() => go('wall')} disabled={!items.length}>Save to diary</Pill></div>
    </div>
  )
}

/* ---------- DIARY ---------- */
type Post = { who: string; avatar: string; when: string; img: string; title: string; caption: string; stars: number; likes: number; comments: [string, string][]; tint: string }
const POSTS: Post[] = [
  { who: 'Saoirse', avatar: '/r2a/street-1.jpg', when: '2h', img: '/r2a/photo-5.jpg', title: 'Rainy-day **comfort bowl**', caption: 'Cried a bit. Good cry. The flat finally smells like a home.', stars: 5, likes: 42, comments: [['Leo', 'Saving this for Sunday'], ['Mary', 'So proud of you x']], tint: C.apricot },
  { who: 'Leo', avatar: '/r2a/photo-3.jpg', when: '5h', img: '/r2a/photo-3.jpg', title: 'Attempted **crispy rice**', caption: 'Smoke alarm went off twice. Still ate every bit.', stars: 2, likes: 88, comments: [['Jack', 'A rite of passage']], tint: C.sun },
  { who: 'Jack', avatar: '/r2a/photo-4.jpg', when: '1d', img: U('1594955332421-2033cfd867b4', 700), title: 'Monday **bento**', caption: 'First time meal prepping. Felt like a functioning adult.', stars: 4, likes: 31, comments: [['Maya', 'Teach me your ways']], tint: C.lilac },
]
function Diary() {
  const [tab, setTab] = useState<'Friends' | 'You'>('Friends')
  const [liked, setLiked] = useState<Record<number, boolean>>({})
  const [pop, setPop] = useState<number | null>(null)
  const like = (i: number) => { setLiked((l) => ({ ...l, [i]: !l[i] })); setPop(i); setTimeout(() => setPop(null), 600) }
  return (
    <div className="pb-28">
      <TopBar />
      <div className="flex items-end justify-between px-4 pt-6"><T text="Food **diary**" size={32} /><div className="flex rounded-full p-1 text-[13px]" style={{ background: C.glass }}>{(['Friends', 'You'] as const).map((t) => <button key={t} onClick={() => setTab(t)} className="rounded-full px-4 py-1 transition" style={tab === t ? { background: C.ink, color: '#fff' } : { color: C.mute }}>{t}</button>)}</div></div>
      {tab === 'You' ? (
        <div className="px-4 pt-8" style={{ animation: 'v7-in 400ms both' }}>
          <div className="relative overflow-visible rounded-[32px] p-6" style={{ background: C.violet, color: '#fff', boxShadow: CARD_SHADOW }}>
            <Plate d={RECIPES[0].dish} size={110} className="absolute -right-4 -top-8" />
            <p className="text-[12px] text-white/70">Your winter so far</p>
            <T text="Mostly **soup**, some courage." size={26} className="mt-2 w-[58%]" light="#fff" />
            <div className="mt-8 grid grid-cols-3 gap-4">{[['37', 'meals'], ['9', 'new recipes'], ['5', 'day streak']].map(([n, l]) => <div key={l}><p className="text-[30px] font-semibold leading-none" style={{ ...SERIF, color: C.sun }}>{n}</p><p className="mt-1 text-[12px] text-white/70">{l}</p></div>)}</div>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4">{[...RECIPES, ...RECIPES].slice(0, 6).map((r, i) => <Plate key={i} d={r.dish} size={82} />)}</div>
        </div>
      ) : (
        <div className="mt-8 space-y-8 px-4">
          {POSTS.map((p, i) => (
            <article key={i} className="rounded-[30px] p-2" style={{ background: p.tint, boxShadow: CARD_SHADOW, animation: `v7-in 450ms ${i * 80}ms both` }}>
              <div className="flex items-center gap-2 px-2 py-2"><img src={p.avatar} alt="" className="h-8 w-8 rounded-full object-cover" /><p className="flex-1 text-[14px] font-medium">{p.who}</p><Meta>{p.when}</Meta></div>
              <div className="relative overflow-hidden rounded-[24px]" onDoubleClick={() => like(i)}>
                <img src={p.img} alt="" className="aspect-[4/5] w-full object-cover" />
                {pop === i && liked[i] && <span className="absolute inset-0 grid place-items-center text-white" style={{ animation: 'v7-heart 600ms ease-out both' }}><Ico d={I.heart} size={72} fill="#fff" w={0} /></span>}
              </div>
              <div className="px-4 pb-4 pt-4">
                <div className="flex items-start justify-between gap-4"><T text={p.title} size={20} /><span className="flex shrink-0 gap-[2px] pt-1">{[1, 2, 3, 4, 5].map((n) => <span key={n} className="h-1.5 w-1.5 rounded-full" style={{ background: n <= p.stars ? C.coral : '#dcd8e6' }} />)}</span></div>
                <p className="mt-2 text-[14px] leading-relaxed">{p.caption}</p>
                <div className="mt-4 space-y-1">{p.comments.map(([n, c]) => <p key={n} className="text-[13px]"><span className="font-medium">{n}</span> <span style={{ color: C.mute }}>{c}</span></p>)}</div>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => like(i)} className="flex h-10 items-center gap-2 rounded-full px-4 text-[13px] transition active:scale-95" style={liked[i] ? { background: C.coral, color: '#fff' } : { background: '#fff' }}><Ico d={I.heart} size={16} fill={liked[i] ? '#fff' : 'none'} />{p.likes + (liked[i] ? 1 : 0)}</button>
                  <span className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[13px]"><Ico d={I.chat} size={16} />{p.comments.length}</span>
                  <span className="ml-auto text-[13px]" style={{ color: C.mute }}>Cook this</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- shell ---------- */
export default function R2AApp({ screen, onScreen }: { screen: Screen; onScreen: (s: Screen) => void }) {
  const [recipe, setRecipe] = useState('stew')
  const [saved, setSaved] = useState<string[]>(['stew'])
  const toggle = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const open = (id: string) => { setRecipe(id); onScreen('cook') }
  const nav: [Screen, React.ReactNode, string][] = [['home', I.home, 'Home'], ['recipes', I.stories, 'Stories'], ['bento', I.bento, 'Bento'], ['wall', I.diary, 'Diary']]
  const active = screen === 'cook' ? 'recipes' : screen === 'rank' ? 'home' : screen
  return (
    <div className="relative mx-auto h-[640px] w-[310px] shrink-0 overflow-hidden rounded-[46px] border-[7px] border-white shadow-[0_50px_100px_-40px_rgba(60,48,120,0.55)]" style={{ background: C.bg, color: C.ink, fontFamily: '"Instrument Sans", system-ui, sans-serif' }}>
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full opacity-70 blur-3xl" style={{ background: C.lilac }} />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-64 w-64 rounded-full opacity-70 blur-3xl" style={{ background: C.apricot }} />
      <div className="absolute left-1/2 top-2 z-30 h-6 w-24 -translate-x-1/2 rounded-full bg-[#1c1a2b]" />
      <div key={screen} className="relative h-full overflow-y-auto overflow-x-hidden [scrollbar-width:none]" style={{ animation: 'v7-in 450ms cubic-bezier(.22,1,.36,1) both' }}>
        {screen === 'home' && <Home go={onScreen} open={open} />}
        {screen === 'recipes' && <Stories open={open} saved={saved} toggle={toggle} />}
        {screen === 'cook' && <Cook id={recipe} go={onScreen} saved={saved} toggle={toggle} />}
        {screen === 'rank' && <Ranking open={open} go={onScreen} />}
        {screen === 'bento' && <Bento go={onScreen} />}
        {screen === 'wall' && <Diary />}
      </div>
      {screen !== 'cook' && (
        <nav className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around px-4 pb-4 pt-2 backdrop-blur-xl" style={{ background: 'rgba(255,255,255,.78)' }}>
          {nav.map(([k, d, l]) => <button key={k} onClick={() => onScreen(k)} className="flex h-10 items-center gap-2 rounded-2xl px-2 transition-all duration-300" style={{ color: active === k ? C.coral : '#b8b5c4' }}><Ico d={d} size={20} />{active === k && <span className="text-[12px] font-semibold" style={{ animation: 'v7-in 300ms both' }}>{l}</span>}</button>)}
        </nav>
      )}
      <style>{`
        @keyframes v7-in { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        @keyframes v7-place { from { opacity: 0; transform: scale(.6) rotate(-30deg) } to { opacity: 1; transform: none } }
        @keyframes v7-eq { 0%,100% { transform: scaleY(.4) } 50% { transform: scaleY(1) } }
        @keyframes v7-heart { 0% { transform: scale(.4); opacity: 0 } 40% { transform: scale(1.1); opacity: 1 } 100% { transform: scale(1); opacity: 0 } }
      `}</style>
    </div>
  )
}
