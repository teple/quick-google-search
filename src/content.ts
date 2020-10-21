// 1. 검색상자 찾기
// 2. 검색결과배열 찾기
//   1. 검색결과들에 O 키프레스 이벤트 걸기 (location.href or window.open)
//   2.  (index 유지 or 갱신)
// 3. 바디에 이벤트 걸기
//   1. 돔에 J / K → 검색결과 배열 탐색 후 포커스 주기
//   2. 돔에 Ctrl + / → 검색상자로 바로가기 이벤트 걸기

//    box-shadow: 0px 4px 8px 0px #b6b6b6

type Index = number | null

const KEY_CODE = {
  SLASH: 191,
  KEY_J: 74,
  KEY_K: 75,
  KEY_O: 79,
  KEY_T: 84
} as const

// 클래스네임 바뀔지도 모름
const SELECTOR = {
  SEARCH_BOX: '#tsf > div:nth-child(2) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input',
  SEARCH_RESULTS: '#rso > div > div > div.yuRUbf > a',
  MAIN: 'body > #main'
} as const

let latestAnchorIndex: Index = null

// 검색상자
const searchBox = document.querySelector(SELECTOR.SEARCH_BOX) as HTMLInputElement
// 검색결과들
const searchResults = Array.from(
  document.querySelectorAll(SELECTOR.SEARCH_RESULTS)
) as HTMLAnchorElement[]

// 검색결과들에 이벤트 걸기
searchResults.forEach((el) => {
  el.addEventListener('keydown', (e) => {
    if (e.keyCode === KEY_CODE.KEY_O) {
      location.href = el.href
      return
    }

    if (e.keyCode === KEY_CODE.KEY_T) {
      window.open(el.href, '_blank', 'noopener')
    }
  })
  el.addEventListener('focus', (e) => {
    if (!(e.target instanceof HTMLAnchorElement)) return

    const index = searchResults.indexOf(e.target)
    if (index === -1) return

    if (index === latestAnchorIndex) return // 필요없나 ..?

    latestAnchorIndex = index

    // className
    const parent = el.parentElement?.parentElement
    parent?.classList.add('active')
  })
  el.addEventListener('blur', (e) => {
    if (!(e.target instanceof HTMLAnchorElement)) return

    // className
    const parent = el.parentElement?.parentElement
    parent?.classList.remove('active')
  })
})

document.body.addEventListener('keydown', (e) => {
  if (e.target === searchBox) {
    return
  }

  // 바디에 Ctrl or Command + / → 검색상자로 바로가기 이벤트 걸기
  if ((e.metaKey || e.ctrlKey) && e.keyCode === KEY_CODE.SLASH) {
    searchBox.click()
    searchBox.focus()
    searchBox.select()

    return
  }

  // 바디에 J / K → 검색결과 배열 탐색 후 포커스 주기
  if (searchResults.length === 0) return

  if (e.keyCode !== KEY_CODE.KEY_J && e.keyCode !== KEY_CODE.KEY_K) return

  if (latestAnchorIndex === null) {
    searchResults[0].focus()
    return
  }

  const indexToCompare = ((index): number => {
    return e.keyCode === KEY_CODE.KEY_J ? index + 1 : index - 1
  })(latestAnchorIndex)

  const nextIndex = ((indexToCompare, lastIndex, latestIndex): number => {
    // -1 or 11
    if (indexToCompare < 0 || indexToCompare > lastIndex) {
      return latestIndex
    }
    return indexToCompare
  })(indexToCompare, searchResults.length - 1, latestAnchorIndex)

  searchResults[nextIndex].focus()
})
