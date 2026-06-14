# TalkBingo 데모 — 3개 surface 연결 가이드

데모 호스팅: `https://cammupco-ui.github.io/talkbingo-demo/`  (배포 후 확정)
컨텍스트 파라미터 `?ctx=` : `app`(기본, CTA=앱 다운로드) · `company`(CTA에 "← 되돌아 가기" 추가) · `inapp`(추후, 앱 내부용)

---

## 1) talkbingo.app — 히어로 iframe  (Next.js 소스에서)
랜딩 첫 화면을 데모로. Next.js **소스**의 히어로 컴포넌트에 추가(빌드 산출물 직접수정 금지):
```jsx
<section style={{height:'100vh'}}>
  <iframe src="https://cammupco-ui.github.io/talkbingo-demo/"
          style={{width:'100%',height:'100%',border:0}} allow="clipboard-write" />
</section>
```
(또는 기존 "PLAY NOW" 버튼을 위 URL 새 탭 링크로만 연결 — 더 간단)

## 2) cammuplabs.com — 회사 소개 섹션 iframe
```html
<iframe src="https://cammupco-ui.github.io/talkbingo-demo/?ctx=company"
        style="width:100%;height:100vh;border:0"></iframe>
```

## 3) 앱(Flutter) 홈 — "How to play" 버튼 → 데모 열기
pubspec에 `url_launcher` 필요(없으면 추가). 홈 화면 적절한 위치에:
```dart
import 'package:url_launcher/url_launcher.dart';
// import 'package:talkbingo_app/styles/app_colors.dart';
// import 'package:talkbingo_app/styles/app_text_styles.dart';

GestureDetector(
  onTap: () => launchUrl(
    Uri.parse('https://cammupco-ui.github.io/talkbingo-demo/?ctx=inapp'),
    mode: LaunchMode.inAppBrowserView, // 또는 externalApplication
  ),
  child: Container(
    height: 48,
    padding: const EdgeInsets.symmetric(horizontal: 20),
    alignment: Alignment.center,
    decoration: BoxDecoration(
      gradient: const LinearGradient(colors: [AppColors.host, AppColors.hostGradientEnd]),
      borderRadius: BorderRadius.circular(40),
    ),
    child: Text('How to play', style: AppTextStyles.buttonEn),
  ),
)
```
> 인앱에서는 CTA "앱 다운로드"가 어색 → `?ctx=inapp`로 열고, 데모 CTA를 "닫기/계속하기"로 바꾸는 inapp 모드 추가 권장(소규모).

---
모든 surface가 같은 데모 한 소스를 가리킴 → 데모 수정 시 이 repo만 갱신(build.sh → dist 복사).
