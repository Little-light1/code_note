export enum BooleanTransform {
    true = 1,
    false = 0,
}
export function boolean2Int(value: number | 'true' | 'false' | boolean = true) {
    if (typeof value === 'number') {
        return value;
    }

    return BooleanTransform[String(value) as 'true' | 'false'];
}
