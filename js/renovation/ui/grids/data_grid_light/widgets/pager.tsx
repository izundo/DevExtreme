/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, OneWay, InternalState, Consumer, Effect,
} from '@devextreme-generator/declarations';
import { PlaceholderExtender } from '../../../../utils/plugin/placeholder_extender';

import messageLocalization from '../../../../../localization/message';

import { PagerContent } from '../../../pager/content';
import { PagingPlugin, PagingPluginData } from './paging';
import { FooterPlaceholder } from '../views/footer';
import { Plugins, PluginsContext } from '../../../../utils/plugin/context';

const DATAGRID_PAGER_CLASS = 'dx-datagrid-pager';

export const viewFunction = (viewModel: Pager): JSX.Element => (
  <PlaceholderExtender
    type={FooterPlaceholder}
    order={1}
    template={(): JSX.Element => (
      <PagerContent
        className={DATAGRID_PAGER_CLASS}
        pageSizes={viewModel.allowedPageSizes}
        displayMode={viewModel.props.displayMode}
        infoText={viewModel.props.infoText}
        showInfo={viewModel.props.showInfo}
        showNavigationButtons={viewModel.props.showNavigationButtons}
        showPageSizes={viewModel.props.showPageSizeSelector}
        pageCount={viewModel.pageCount}
        visible={viewModel.props.visible}
        totalCount={viewModel.totalCount}

        pageIndex={viewModel.pageIndex}
        pageIndexChange={viewModel.onPageIndexChange}

        pageSize={viewModel.pageSize === 'all' ? 0 : viewModel.pageSize}
        pageSizeChange={viewModel.onPageSizeChange}
      />
    )}
  />
);

@ComponentBindings()
export class PagerProps {
  @OneWay()
  allowedPageSizes: (number | 'all')[] | 'auto' = 'auto';

  @OneWay()
  displayMode: 'adaptive' | 'compact' | 'full' = 'adaptive';

  @OneWay()
  infoText = messageLocalization.format('dxPager-infoText');

  @OneWay()
  showInfo = false;

  @OneWay()
  showNavigationButtons = false;

  @OneWay()
  showPageSizeSelector = false;

  @OneWay()
  visible = true;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class Pager extends JSXComponent(PagerProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  pageIndex = 0;

  @InternalState()
  pageSize: number | 'all' = 0;

  @InternalState()
  totalCount = 0;

  @InternalState()
  pageCount = 0;

  @Effect()
  subscribeToPagingPluginUpdates(): void {
    this.plugins.watch(PagingPlugin, (prop: PagingPluginData) => {
      this.pageIndex = prop.pageIndex;
      this.pageSize = prop.pageSize;
      this.totalCount = prop.totalCount;
      this.pageCount = prop.pageCount;
    });
  }

  onPageSizeChange(pageSize: number): void {
    const setPageSize = this.plugins.getValue(PagingPlugin)?.setPageSize;
    if (!setPageSize) {
      return;
    }

    if (pageSize === 0) {
      setPageSize('all');
    } else {
      setPageSize(pageSize);
    }
  }

  onPageIndexChange(pageIndex: number): void {
    this.plugins.getValue(PagingPlugin)?.setPageIndex?.(pageIndex);
  }

  get allowedPageSizes(): (number | 'all')[] {
    // eslint-disable-next-line prefer-destructuring
    const pageSize = this.pageSize;

    if (this.props.allowedPageSizes === 'auto') {
      if (pageSize === 'all') {
        return [];
      }
      return [
        Math.floor(pageSize / 2),
        pageSize,
        pageSize * 2,
      ];
    }

    return this.props.allowedPageSizes;
  }
}
