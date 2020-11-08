/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';

import {AppCommonModule} from 'src/app/common/common.module';

import {GuildEventTableComponent} from './event-table.component';

@NgModule({
  imports: [AppCommonModule, BrowserModule, CommonModule, MatButtonModule, MatTableModule],
  declarations: [GuildEventTableComponent],
  exports: [GuildEventTableComponent],
})
export class GuildEventTableModule {}
