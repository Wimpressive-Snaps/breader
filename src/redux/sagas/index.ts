import { all, fork } from 'redux-saga/effects'
import { watchFetchArticles, watchSelectAndReadArticles } from './articles'
import { watchFetchFeeds, watchParseFeed } from './feeds'

export default function* () {
    yield all([
        fork(watchSelectAndReadArticles),
        fork(watchFetchArticles),
        fork(watchFetchFeeds),
        fork(watchParseFeed),
    ])
}
