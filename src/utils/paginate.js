import _ from 'lodash'

export function paginate(items, pagenumber, pageSize) {
    const startIndex = (pagenumber - 1) * pageSize
    return _(items).slice(startIndex).take(pageSize).value()

}