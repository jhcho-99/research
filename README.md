# research

해외주식 기업 분석 자료를 모아 보는 정적 사이트 템플릿입니다. 빌드 단계 없이 HTML/CSS/JS만 사용하고, GitHub Pages로 공개합니다.

## 구조

```
site/                    # GitHub Pages로 공개되는 폴더
  index.html             # 목록 (검색·시장 필터)
  report.html            # 분석 자료 상세 (?id=...)
  assets/                # style.css, app.js, report.js, md.js(마크다운 렌더러)
  data/reports.json      # 분석 자료 목록(메타데이터)
  reports/*.md           # 분석 자료 본문 (마크다운)
.github/workflows/pages.yml   # main에 push하면 자동 배포
```

## 새 분석 자료 추가

1. `site/reports/template.md`를 복사해 `site/reports/<id>.md`로 저장하고 내용을 채웁니다. (`<id>`는 영문·숫자·`-`·`_`, 예: `nvda-2026q3`)
2. `site/data/reports.json`에 항목을 추가합니다.

```json
{
  "id": "nvda-2026q3",
  "ticker": "NVDA",
  "name": "NVIDIA",
  "market": "미국",
  "sector": "반도체",
  "date": "2026-10-20",
  "title": "분석 제목",
  "summary": "목록에 보일 한두 줄 요약",
  "tags": ["AI", "반도체"],
  "keyData": {
    "투자의견": "BUY",
    "목표주가": "$000",
    "현재주가": "$000",
    "시가총액": "$00B"
  }
}
```

3. 커밋하고 push하면 자동 배포됩니다.

마크다운은 제목(`#`), 목록, 표, 인용(`>`), 굵게/기울임, 링크(http/https), 코드를 지원합니다.

## 로컬 미리보기

```bash
node serve.js 8770
# http://localhost:8770
```

`fetch`를 쓰기 때문에 `index.html`을 파일로 직접 열면 목록이 보이지 않습니다. 반드시 서버로 여세요.

## GitHub Pages 배포

1. GitHub에서 새 저장소를 만듭니다. (예: `research`)
2. 저장소 **Settings → Pages → Source**를 **GitHub Actions**로 선택합니다.
3. 로컬에서 원격 저장소를 연결하고 push합니다.

```bash
git remote add origin https://github.com/<계정>/<저장소>.git
git push -u origin main
```

배포 주소는 `https://<계정>.github.io/<저장소>/` 입니다.

## 유의사항

분석 자료는 투자 권유가 아니라 개인 기록용입니다. 목록·상세 페이지 하단에 투자 유의사항 문구가 들어 있으니 지우지 마세요.
