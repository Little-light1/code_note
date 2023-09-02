export enum BooleanTransform {
    true = 0,
    false = 1,
}
export function boolean2Int(
    value: number | 'true' | 'false' | boolean,
    booleanTransform = BooleanTransform,
) {
    if (typeof value === 'number') {
        return value;
    }

    return booleanTransform[String(value) as 'true' | 'false'];
}
