import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import Popup from '../../model/popup';
import asyncForEach from '../../helpers/asyncForEach';

fixture`Popup`
  .page(url(__dirname, './pages/T920408.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('Popup should be centered regarding the container even if container is animated (T920408)', async (t) => {
  const outerPopup = new Popup('#popup');
  const wrapper = outerPopup.content.find('.dx-overlay-wrapper');
  const content = wrapper.find('.dx-overlay-content');

  const wrapperRect: { bottom: number; top: number; left: number; right: number } = {
    bottom: 0, top: 0, left: 0, right: 0,
  };
  const contentRect: { bottom: number; top: number; left: number; right: number } = {
    bottom: 0, top: 0, left: 0, right: 0,
  };

  await asyncForEach(['bottom', 'left', 'right', 'top'], async (prop) => {
    wrapperRect[prop] = await wrapper.getBoundingClientRectProperty(prop);
    contentRect[prop] = await content.getBoundingClientRectProperty(prop);
  });

  const wrapperVerticalCenter = (wrapperRect.bottom + wrapperRect.top) / 2;
  const wrapperHorizontalCenter = (wrapperRect.left + wrapperRect.right) / 2;
  const contentVerticalCenter = (contentRect.bottom + contentRect.top) / 2;
  const contentHorizontalCenter = (contentRect.left + contentRect.right) / 2;

  await t
    .expect(wrapperVerticalCenter)
    .within(contentVerticalCenter - 0.5, contentVerticalCenter + 0.5);

  await t
    .expect(wrapperHorizontalCenter)
    .within(contentHorizontalCenter - 0.5, contentHorizontalCenter + 0.5);
});

test('Popup wrapper left top corner should be the same as the container right left corner even if container is animated', async (t) => {
  const outerPopup = new Popup('#popup');
  const wrapper = outerPopup.content.find('.dx-overlay-wrapper');
  const container = wrapper.parent();

  const wrapperRect: { top: number; left: number } = { top: 0, left: 0 };
  const containerRect: { top: number; left: number } = { top: 0, left: 0 };

  await asyncForEach(['left', 'top'], async (prop) => {
    wrapperRect[prop] = await wrapper.getBoundingClientRectProperty(prop);
    containerRect[prop] = await container.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(wrapperRect.top)
    .within(containerRect.top - 0.5, containerRect.top + 0.5);

  await t
    .expect(wrapperRect.left)
    .within(containerRect.left - 0.5, containerRect.left + 0.5);
});

fixture`Popup T946851`
  .page(url(__dirname, './pages/T946851.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('There should not be any errors when position.of is html (T946851)', async (t) => {
  await t
    .expect(true).ok();
});

fixture`Popup drag borders`
  .page(url(__dirname, './pages/popupDrag/containerBorders.html'));

test('Popup can not be dragged outside of the container (window)', async (t) => {
  const popup = new Popup('#popup');
  const { content, toolbar } = popup;

  const popupRect: { bottom: number; top: number; left: number; right: number } = {
    bottom: 0, top: 0, left: 0, right: 0,
  };

  await t
    .resizeWindow(700, 700)
    .drag(toolbar, -10000, -10000);

  await asyncForEach(['bottom', 'left', 'top', 'right'], async (prop) => {
    popupRect[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(popupRect.top)
    .eql(0);

  await t
    .expect(popupRect.left)
    .eql(0);

  await t
    .drag(toolbar, 10000, 10000);

  await asyncForEach(['bottom', 'left', 'top', 'right'], async (prop) => {
    popupRect[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(popupRect.bottom)
    .eql(700);

  await t
    .expect(popupRect.right)
    .eql(700);
});

fixture`Popup drag in small container`
  .page(url(__dirname, './pages/popupDrag/containerSmallerThanContent.html'));

test('Popup can not be dragged if content bigger than container', async (t) => {
  const content = Selector('.dx-overlay-content');
  const toolbar = Selector('.dx-popup-title');

  const popupPosition: { top: number; left: number } = {
    top: 0, left: 0,
  };

  const newPopupPosition: { top: number; left: number } = {
    top: 0, left: 0,
  };

  await asyncForEach(['left', 'top'], async (prop) => {
    popupPosition[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .drag(toolbar, 50, 50);

  await asyncForEach(['left', 'top'], async (prop) => {
    newPopupPosition[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(popupPosition.top)
    .eql(newPopupPosition.top);

  await t
    .expect(popupPosition.left)
    .eql(newPopupPosition.left);
});

fixture`Popup drag with enabled dragOutsideBoundary option`
  .page(url(__dirname, './pages/popupDrag/dragOutsideBoundary.html'));

test('Popup can be dragged outside of the container if dragOutsideBoundary is enabled', async (t) => {
  const popup = new Popup('#popup');
  const { content, toolbar } = popup;

  const popupPosition: { top: number; left: number } = {
    top: 0, left: 0,
  };

  await t
    .drag(toolbar, -10000, -10000);

  await asyncForEach(['left', 'top'], async (prop) => {
    popupPosition[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(popupPosition.top)
    .lt(0);

  await t
    .expect(popupPosition.left)
    .lt(0);
});
