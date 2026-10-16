(function () {
  var root = document.getElementById('report');
  var id = new URLSearchParams(location.search).get('id');

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function fail(msg) {
    root.textContent = '';
    root.appendChild(el('p', 'empty', msg));
  }

  if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) { fail('잘못된 주소입니다.'); return; }

  function keyData(meta) {
    var box = el('aside', 'keydata');
    box.appendChild(el('h3', null, 'Key Data'));
    var dl = el('dl');
    var data = meta.keyData || {};
    Object.keys(data).forEach(function (k) {
      var row = el('div', 'kv' + (k === '투자의견' || k === '목표주가' ? ' hl' : ''));
      row.appendChild(el('dt', null, k));
      row.appendChild(el('dd', null, data[k]));
      dl.appendChild(row);
    });
    box.appendChild(dl);
    return Object.keys(data).length ? box : null;
  }

  fetch('data/reports.json')
    .then(function (res) { return res.json(); })
    .then(function (list) {
      var meta = list.filter(function (r) { return r.id === id; })[0];
      if (!meta) throw new Error('not found');
      return fetch('reports/' + meta.id + '.md')
        .then(function (res) { if (!res.ok) throw new Error('md'); return res.text(); })
        .then(function (md) { return { meta: meta, md: md }; });
    })
    .then(function (d) {
      var m = d.meta;
      document.title = m.ticker + ' ' + m.title + ' · 해외주식 분석자료';

      var head = el('header', 'report-head');
      head.appendChild(el('span', 'kicker', [m.market, m.sector, '기업분석'].filter(Boolean).join(' | ')));
      head.appendChild(el('h1', null, m.title));
      if (m.summary) head.appendChild(el('p', 'lead', m.summary));
      var meta = el('div', 'meta');
      meta.appendChild(el('strong', null, m.ticker));
      meta.appendChild(document.createTextNode(' ' + m.name + ' · ' + m.date));
      head.appendChild(meta);

      var layout = el('div', 'report-layout');
      var body = el('div', 'report-body');
      body.innerHTML = renderMarkdown(d.md);
      layout.appendChild(body);
      var kd = keyData(m);
      if (kd) layout.appendChild(kd);

      root.textContent = '';
      root.appendChild(head);
      root.appendChild(layout);
    })
    .catch(function () { fail('분석 자료를 찾을 수 없습니다.'); });
})();
