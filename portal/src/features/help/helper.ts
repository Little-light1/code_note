export function listToTree(oldArr) {
    oldArr.forEach((element) => {
        element.value = element.docID;
        element.key = element.docID;
        const parentId = element.parentDocID;

        if (parentId) {
            oldArr.forEach((ele) => {
                // 当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
                if (ele.docID === parentId) {
                    if (!ele.children) {
                        ele.children = [];
                    }

                    ele.children.push(element);
                }
            });
        }
    }); // 过滤，按树展开，将多余的数组剔除

    return oldArr.filter((ele) => !ele.parentDocID);
}
export function highlight(str, key) {
    const text = str.replace(
        key,
        `<span style="background: yellow;color:blue;">${key}</span>`,
    );
    return text;
}
