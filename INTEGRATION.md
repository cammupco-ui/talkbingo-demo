# TalkBingo 데모 — surface 연결 가이드

데모 호스팅: `https://talkbingo.app/` (이 repo가 GitHub Pages + custom domain으로 직접 서빙)
컨텍스트 파라미터 `?ctx=` :
- `app` (기본) — CTA = "앱 다운로드 ↓"
- `company` — CTA에 "← 되돌아 가기" 추가 (→ `https://cammuplabs.com/products.html`)
- `inapp` — 다운로드 숨김, primary CTA "계속하기" (→ `talkbingo://home` 딥링크로 앱 홈 복귀)

---

## 1) talkbingo.app — 도메인 직결
이 repo의 CNAME이 `talkbingo.app`. Google 검색·SNS 공유 등 외부 유입이 곧바로 데모를 만남.
기본 ctx=`app` 으로 동작 → 우승 시 앱 다운로드 CTA.

## 2) cammuplabs.com — "Try on Web" 버튼 (products.html)
```html
<a href="https://talkbingo.app/?ctx=company" target="_blank" rel="noopener" class="btn-ghost">
  <span class="en">Try on Web →</span>
  <span class="kr">웹에서 시작하기 →</span>
</a>
```

## 3) 앱(Flutter) 홈 — "게임 체험하기" 버튼 (home_screen.dart)
```dart
import 'package:url_launcher/url_launcher.dart';

onTap: () => launchUrl(
  Uri.parse('https://talkbingo.app/?ctx=inapp'),
  mode: LaunchMode.inAppBrowserView,
),
```
"계속하기" 클릭 시 데모가 `talkbingo://home` 딥링크 호출 → OS가 인앱 브라우저 닫고 앱 홈 복귀.

---
모든 surface가 같은 한 소스를 가리킴 → 데모 수정 시 이 repo만 갱신.
빌드: 메인 repo `web_demo_proto/game/` → `./build.sh` → `cp -R dist/. ~/Desktop/talkbingo-demo/` → commit & push.
