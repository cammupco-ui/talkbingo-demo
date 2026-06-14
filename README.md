# talkbingo-demo

talkbingo.app / cammuplabs.com 에 임베드되는 TalkBingo 체험 데모 (자체완결형·프리컴파일).

## 배포 (GitHub Pages)
1. GitHub에 빈 repo `talkbingo-demo` (Public) 생성
2. 아래 커맨드로 push
3. Settings → Pages → Source: Deploy from a branch, Branch: main /(root) → Save
4. 몇 분 뒤 https://<org>.github.io/talkbingo-demo/ 라이브

## 임베드
<!-- talkbingo.app 히어로 -->
<iframe src="https://<org>.github.io/talkbingo-demo/" style="width:100%;height:100vh;border:0" allow="clipboard-write"></iframe>
<!-- cammuplabs.com (되돌아 가기 표시) -->
<iframe src="https://<org>.github.io/talkbingo-demo/?ctx=company" style="width:100%;height:100vh;border:0"></iframe>

## 빌드
소스: 메인 repo의 web_demo_proto/game/ → ./build.sh → dist/ 를 이 repo로 복사.
