/** 绑定key */
export const CLASSKEY = {
  ENTER: 'KEYDOWN-ENTER',
  JUMPNEXT: 'KEYDOWN-JUMP',
}
/** 按键组合 */
export const combinationKey = {
  controlS: ['control', 's'],
  controlN: ['control', 'n'],
  controlShiftS: ['control', 'shift', 's'],
  metaArrowright: ['meta', 'arrowright'],
}
/** 拦截按键 */
export const screenKey = {
  metaO: ['meta', 'o'],
  metaP: ['meta', 'p'],
  metaF: ['meta', 'f']
}
/** 处理过程 */
export const HANDLERSTATUS = {
  NOTHING: 1,
  JUMPNEXT: 2,
}
/** 每一个元素添加监听 */
const keyboardListen = (beforeHandler, combinationHandler) => {
  let keyQueue = [];
  const body = document.querySelector('.mc-body');
  const page = Array.prototype.slice.call(body.childNodes).find(page => page.style.display !== 'none');

  /** 查询父节点 */
  function findParentNodeByClassName(el, className) {
    if (el.classList.contains(className)) {
      return el;
    }
    return findParentNodeByClassName(el.parentNode, className);
  }

  function enterEvent(el) {
    if (['INPUT', 'TEXTAREA', 'BUTTON'].includes(el.tagName)) {
      if (beforeHandler(el, HANDLERSTATUS.NOTHING)) return;
      // Select
      if (el.ariaHasPopup ==='listbox') {
        return el.ariaExpanded === 'true' ? nextElementFocus(el) : el.click();
      }
      el.click();
      nextElementFocus(el);
    }
  }

  function nextElementFocus(el) {
    // const enterForm = $(el).closest('.KEYDOWN-ENTER');
    const enterForm = findParentNodeByClassName(el, CLASSKEY.ENTER);
    if (!enterForm) return;
    // const elements = $(enterForm).find(':input[disabled!="disabled"]:visible').toArray();
    const element = Array.prototype.slice.call(enterForm.querySelectorAll('input:not(:disabled), textarea:not(:disabled), button:not(:disabled)'));
    const elements = element.filter(item => {
      return item.style.display !== 'none';
    });
    const nextIndex = elements.findIndex((val) => val === el) + 1;
    if (nextIndex < elements.length) {
      const nextElement = elements[nextIndex];
      if (beforeHandler(nextElement, HANDLERSTATUS.JUMPNEXT)) {
        elements[nextIndex+1] && enterEvent(elements[nextIndex+1]);
        return;
      }
      nextElement.focus();
    } else {
      elements.length && elements[0].focus();
    }
  }

  /** 按键按下 */
  function windowKeyDownTrigger(e) {
    if(page.style.display === 'none') return;
    if (e.key === 'Enter') {
      e.preventDefault();
      enterEvent(e.target);
      return;
    } else if (keyQueue.length) {
      e.preventDefault();
    }
    dispatchForCode(e).then((code) => {
      if (!keyQueue.some(val => val === code.toLowerCase())) {
        if (typeof code === 'number') {
          keyQueue.push(code);
        } else {
          keyQueue.push(code.toLowerCase());
        }
      }
    });
  }
   /** 按键弹起 */
   function windowKeyUpTrigger(e) {
    if(page.style.display === 'none') return;
    const interceptKey = {...combinationKey,...screenKey};
    const key = Object.keys(interceptKey).find(key => interceptKey[key].join('') === keyQueue.join(''));
    if (key) {
      e.preventDefault();
      combinationHandler(key);
    } else {
      keyQueue = [];
    }
    dispatchForCode(e).then((code) => {
      deleteKeyFromKeyQueue(code);
    });
  }

  const dispatchForCode = (event) => {
    return new Promise((resolve) => {
      let code;
      if (event.key !== undefined) {
        code = event.key;
      } else if (event.keyCode !== undefined) {
        // 未对 keyCode 做兼容
        code = event.keyCode;
      }
      resolve(code);
    });
  };

  function deleteKeyFromKeyQueue(code) {
    const deleteIndex = keyQueue.indexOf(code);
    keyQueue.splice(deleteIndex, 1);
  }

  /** 销毁 */
  function destroy() {
    console.log('destroy');
    window.removeEventListener('keydown', windowKeyDownTrigger);
    window.removeEventListener('keyup', windowKeyUpTrigger);
  }

  /** 添加监听 */
  window.addEventListener('keydown', windowKeyDownTrigger, true);
  window.addEventListener('keyup', windowKeyUpTrigger, false);

  return {
    destroy
  };
};

export default keyboardListen;