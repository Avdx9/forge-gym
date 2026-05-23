export default function Marquee() {
  const items = [
    'Strength & Power', 'HIIT Conditioning', 'Athletic Performance',
    'Personal Training', 'Nutrition Coaching', 'Recovery Science',
    'Elite Community', 'Expert Coaches',
  ];
  const all = [...items, ...items, ...items];
  return (
    <div className="marquee-section">
      <div className="marquee-track">
        {all.map((item, i) => (
          <div className="marquee-item" key={i}>
            <span className="text">{item}</span>
            <span className="sep">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
