export const getStatusMessage = async (status) => {
    const allStatusReq = await fetch('https://status.js.org/codes.json')
    const allStatus = await allStatusReq.json()
    const allStatusArr = Object.entries(allStatus)
    const answer = allStatusArr.find(arr => arr[0] == status)
    return answer[1].message
}