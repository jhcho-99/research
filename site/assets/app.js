(function () {
  var list = document.getElementById('list');
  var filtersEl = document.getElementById('filters');
  var qEl = document.getElementById('q');
  var countEl = document.getElementById('count');
  var emptyEl = document.getElementById('empty');
  var reports = [];
  var market = '전체';

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function matches(r, q) {
    if (market !== '전체' && r.market !== market) return false;
    if (!q) return true;
    var hay = [r.ticker, r.name, r.title, r.summary, r.sector].concat(r.tags || []).join(' ').toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function render() {
    var q = qEl.value.trim().toLowerCase();
    var shown = reports.filter(function (r) { return matches(r, q); });
    list.textContent = '';
    shown.forEach(function (r) {
      var kd = r.keyData || {};
      var a = el('a', 'row');
      a.href = 'report.html?id=' + encodeURIComponent(r.id);

      a.appendChild(el('span', 'date', r.date));

      var stock = el('span', 'stock');
      stock.appendChild(el('span', 'ticker', r.ticker));
      stock.appendChild(el('span', 'company', r.name));
      a.appendChild(stock);

      var main = el('div', 'main');
      main.appendChild(el('h2', null, r.title));
      main.appendChild(el('p', 'summary', r.summary));
      var tags = el('div', 'tags');
      [r.market, r.sector].concat(r.tags || []).filter(Boolean).forEach(function (t) {
        tags.appendChild(el('span', 'tag', t));
      });
      main.appendChild(tags);
      a.appendChild(main);

      a.appendChild(el('span', 'opinion', kd['투자의견'] || '-'));
      a.appendChild(el('span', 'target', kd['목표주가'] || '-'));
      list.appendChild(a);
    });
    countEl.textContent = '총 ' + shown.length + '건';
    emptyEl.hidden = shown.length > 0;
  }

  function renderFilters() {
    var markets = ['전체'];
    reports.forEach(function (r) { if (markets.indexOf(r.market) === -1) markets.push(r.market); });
    filtersEl.textContent = '';
    markets.forEach(function (m) {
      var b = el('button', 'chip', m);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(m === market));
      b.addEventListener('click', function () {
        market = m;
        renderFilters();
        render();
      });
      filtersEl.appendChild(b);
    });
  }

  qEl.addEventListener('input', render);

  fetch('data/reports.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      reports = data.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      renderFilters();
      render();
    })
    .catch(function () {
      countEl.textContent = '';
      emptyEl.textContent = '목록을 불러오지 못했습니다. (파일로 직접 열지 말고 로컬 서버나 GitHub Pages로 확인하세요)';
      emptyEl.hidden = false;
    });
})();
