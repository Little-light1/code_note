// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as React from 'react';
import { UserAction } from '@/common/utils/clientAction/types';
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    action?: UserAction;
  }
}