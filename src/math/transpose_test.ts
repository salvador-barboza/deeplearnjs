/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as dl from '../index';
import * as test_util from '../test_util';
import {MathTests} from '../test_util';

// dl.transpose
{
  const tests: MathTests = it => {
    it('2D (no change)', () => {
      const t = dl.tensor2d([1, 11, 2, 22, 3, 33, 4, 44], [2, 4]);
      const t2 = dl.transpose(t, [0, 1]);

      expect(t2.shape).toEqual(t.shape);
      test_util.expectArraysClose(t2, t);
    });

    it('2D (transpose)', () => {
      const t = dl.tensor2d([1, 11, 2, 22, 3, 33, 4, 44], [2, 4]);
      const t2 = dl.transpose(t, [1, 0]);

      expect(t2.shape).toEqual([4, 2]);
      test_util.expectArraysClose(t2, [1, 3, 11, 33, 2, 4, 22, 44]);
    });

    it('3D [r, c, d] => [d, r, c]', () => {
      const t = dl.tensor3d([1, 11, 2, 22, 3, 33, 4, 44], [2, 2, 2]);
      const t2 = dl.transpose(t, [2, 0, 1]);

      expect(t2.shape).toEqual([2, 2, 2]);
      test_util.expectArraysClose(t2, [1, 2, 3, 4, 11, 22, 33, 44]);
    });

    it('3D [r, c, d] => [d, c, r]', () => {
      const t = dl.tensor3d([1, 11, 2, 22, 3, 33, 4, 44], [2, 2, 2]);
      const t2 = dl.transpose(t, [2, 1, 0]);

      expect(t2.shape).toEqual([2, 2, 2]);
      test_util.expectArraysClose(t2, [1, 3, 2, 4, 11, 33, 22, 44]);
    });

    it('gradient 3D [r, c, d] => [d, c, r]', () => {
      const t = dl.tensor3d([1, 11, 2, 22, 3, 33, 4, 44], [2, 2, 2]);
      const perm = [2, 1, 0];
      const dy =
          dl.tensor3d([111, 211, 121, 221, 112, 212, 122, 222], [2, 2, 2]);
      const dt = dl.vjp(() => dl.transpose(t, perm), t, dy);
      expect(dt.shape).toEqual(t.shape);
      expect(dt.dtype).toEqual('float32');
      test_util.expectArraysClose(dt, [111, 112, 121, 122, 211, 212, 221, 222]);
    });
  };

  test_util.describeMathCPU('transpose', [tests]);
  test_util.describeMathGPU('transpose', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}
