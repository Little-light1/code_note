export enum BooleanTransform {
    true = 0,
    false = 1,
}
export function boolean2Int(value: number | 'true' | 'false' | boolean) {
    if (typeof value === 'number') {
        return value;
    }

    return BooleanTransform[String(value) as 'true' | 'false'];
}
