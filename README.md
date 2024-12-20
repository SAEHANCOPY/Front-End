# 새한문화사 책자 인쇄 견적 및 주문 사이트 - frontend
## 👀 서비스 소개

## 👥 팀원 소개
<table>
  <tr>
    <td align="center">
      <a href="https://github.com/bbky323">
        <img src="https://avatars.githubusercontent.com/u/127292182?v=4" width="200px;" height="200px;" alt="배기영"/>
        <h3><b>배기영</b></h3>
      </a>
    </td>
  </tr>
</table>


## 🛠️ Tech Stacks

### Cowork Tools
![github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)
![figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

### Development
![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)

### Deploy
![aws](https://img.shields.io/badge/Amazon_AWS_S3-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)


## 협업 전략
### Issue Template
```
## Description for development features

## Todo-lists

## ETC
```

### PR Template
```
## Issue number

## Summary & Screenshots

## Describe your changes (option)

## Things to consider (option)
```

### Branch
- Git-flow 전략을 기반으로 main, develop 브랜치와 feature 보조 브랜치 운용
- `feature/{issue-num}-{feature-name}`

### Folder Structure
```
├─.github
├─dist
└─src
    ├─api
    ├─assets
    ├─components
    ├─context
    ├─navigation
    ├─pages
    ├─store
    ├─styles
    └─utils
```

## 📌 Git Convention

### 🔹 Commit Convention

- ✨ `[FEAT]` : 새로운 기능 구현
- 🔧 `[MODIFY]` : 코드 수정 (기능의 변화가 있을 때)
- 📝 `[DOCS]` : README나 WIKI 등의 문서 수정
- ➕ `[ADD]` : Feat 이외의 부수적인 코드 추가, 라이브러리 추가, 새로운 파일 생성
- 🔥 `[REMOVE]` : 폴더 또는 파일 삭제, 쓸모없는 코드 삭제
- 🐛 `[FIX]` : 버그, 오류 해결
- ⏪️ `[RENAME]` : 파일 이름 변경 또는 파일 이동시
- ♻️ `[REFACTOR]` : 기능 추가나 버그 수정이 없는 코드 변경 ( 코드 구조 변경 등의 리팩토링 )
- ✏️ `[CORRECT]` : 문법 오류나 타입의 변경, 이름 변경시
- 🎨 `[STYLE]` : 코드의 의미에 영향을 미치지 않는 변경 사항 ( 스타일 수정, 세미콜론 추가 등 비즈니스 로직에 변경 없음 )
- 🧪 `[TEST]` : 테스트 추가 또는 이전 테스트 수정
- 🧹 `[CHORE]` : src 또는 test 파일을 수정하지 않는 기타 변경 사항 ( 빌드/패키지 매니저 설정 변경 등 )
- 🤝🏻 `[MERGE]` : Merge 하는 경우

#### 커밋 예시

- git commit -m "#이슈 번호 [커밋 태그] 커밋 내용"
  - `ex ) git commit -m "#1 [FEAT] 회원가입 기능 완료"`

<br>

### 🔹 Branch Convention

- [MAIN] : 최종 배포
- [DEVELOP] : 주요 개발, main merge 이전에 거치는 branch
- [FEATURE] : 각자 개발, 기능 추가
- [FIX] : 에러 수정, 버그 수정
- [DOCS] : README, 문서
- [REFACTOR] : 코드 리펙토링 (기능 변경 없이 코드만 수정할 때)
- [MODIFY] : 코드 수정 (기능의 변화가 있을 때)
- [CHORE] : gradle 세팅, 위의 것 이외에 거의 모든 것

#### 브랜치 명 예시

- feature/#이슈 번호-기능 이름
  - `ex) feature/#1-login`

<br>

### 🔹 Branch Strategy

#### Git Flow

기본적으로 Git Flow 전략을 이용한다. Fork한 후 나의 repository에서 작업하고 구현 후 원본 repository에 pr을 날린다. 작업 시작 시 선행되어야 할 작업은 다음과 같다.

```java
1. Issue를 생성한다.
2. feature Branch를 생성한다.
3. Add - Commit - Push - Pull Request 의 과정을 거친다.
4. Pull Request가 작성되면 작성자 이외의 다른 팀원이 Code Review를 한다.
5. Code Review가 완료되면 Pull Request 작성자가 develop Branch로 merge 한다.
6. merge된 작업이 있을 경우, 다른 브랜치에서 작업을 진행 중이던 개발자는 본인의 브랜치로 merge된 작업을 Pull 받아온다.
7. 종료된 Issue와 Pull Request의 Label과 Project를 관리한다.
```

- 기본적으로 git flow 전략을 사용합니다.
- main, develop, feature 3가지 branch 를 기본으로 합니다.
- main → develop → feature. feature 브랜치는 feat/기능명으로 사용합니다.
- 이슈를 사용하는 경우 브랜치명을 feature/[issue num]-[feature name]로 합니다.

<br>

### 🔹 Issue Convention

- [FEAT] : 기능 추가
- [FIX] : 에러 수정, 버그 수정
- [DOCS] : README, 문서
- [REFACTOR] : 코드 리펙토링 (기능 변경 없이 코드만 수정할 때)
- [MODIFY] : 코드 수정 (기능의 변화가 있을 때)
- [CHORE] : gradle 세팅, 위의 것 이외에 거의 모든 것

`ex) [feat] user api 구현`


## 관련 문서
[Figma](https://www.figma.com/design/UsmgQ87Ylp8ej1bi1eeCAJ/%EC%95%84%EB%9D%A0---%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8?node-id=14-2&t=OE1nHotGFNeNKaDZ-0)

[Notion](https://www.notion.so/ATTI-b22fe268d2104c7d8543f5c51df9259b)

[Github Project](https://github.com/orgs/ATTI-UMC/projects/1)
