export function isNeedToSubmitDataForm(state: any): boolean {
    const {isPermissionEdited, activeSystem} = state;
    const {data = {}} = isPermissionEdited;

    if (data.hasOwnProperty(activeSystem.code) && data[activeSystem.code]) {
        return true;
    }

    return false;
}
