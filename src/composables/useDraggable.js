import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

const ANI_TIME = 0.15

export default function useDraggable(target, option) {
  const dragIndexMap = {}
  const dragIndexSeqMap = {}
  const getDragIndexSeq = () => {
    return Object.entries(dragIndexSeqMap)
      .sort((a, b) => {
        return a[1] - b[1]
      })
      .map((item) => item[0])
  }

  function getDragIndex(element) {
    return dragIndexMap[element.dataset.dragIndex]
  }

  // main process
  for (let i = 0; i < target.children.length; i++) {
    const element = target.children[i]
    dragIndexSeqMap[element.dataset.dragIndex] = i
    gsap.to(element, {
      x: i * option?.width + i * option?.gapX,
      y: i * option?.height + i * option?.gapY,
      duration: 0,
    })
    dragIndexMap[element.dataset.dragIndex] = element
    let hitIndex = null
    let hitBox = []
    let lock = false

    function onPress() {
      hitBox = []
      hitIndex = dragIndexSeqMap[element.dataset.dragIndex]
      const seq = getDragIndexSeq()
      Array.prototype.forEach.call(seq, (path) => {
        const item = dragIndexMap[path]
        Draggable.get(item).update()
        hitBox.push({
          x: Draggable.get(item).x,
          y: Draggable.get(item).y,
        })
      })
    }

    function onDrag() {
      if (lock) return
      const seq = getDragIndexSeq()
      const currentIndex = dragIndexSeqMap[element.dataset.dragIndex]

      for (let j = 0; j < seq.length; j++) {
        const item = dragIndexMap[seq[j]]
        if (element.dataset.dragIndex != item.dataset.dragIndex) {
          if (this.hitTest(getDragIndex(item), '30%')) {
            hitIndex = j
            dragIndexSeqMap[element.dataset.dragIndex] = hitIndex
            // 拖到后方
            if (currentIndex < j) {
              for (let k = currentIndex + 1; k <= j; k++) {
                gsap.to(dragIndexMap[seq[k]], {
                  x: hitBox[k - 1].x,
                  y: hitBox[k - 1].y,
                  duration: ANI_TIME,
                  onStart() {
                    lock = true
                  },
                  onComplete() {
                    lock = false
                    dragIndexSeqMap[dragIndexMap[seq[k]].dataset.dragIndex] = k - 1
                  },
                })
              }
            }
            // 拖到前方
            if (currentIndex > j) {
              for (let k = j; k < currentIndex; k++) {
                gsap.to(dragIndexMap[seq[k]], {
                  x: hitBox[k + 1].x,
                  y: hitBox[k + 1].y,
                  duration: ANI_TIME,
                  onStart() {
                    lock = true
                  },
                  onComplete() {
                    lock = false
                    dragIndexSeqMap[dragIndexMap[seq[k]].dataset.dragIndex] = k + 1
                  },
                })
              }
            }
            break
          }
        }
      }
    }

    function onRelease() {
      if (lock) return setTimeout(onRelease, (ANI_TIME / 3) * 1000)
      if (hitIndex == null) return
      if (option.onChange) option.onChange(getDragIndexSeq())
      gsap.to(element, {
        x: hitBox[hitIndex].x,
        y: hitBox[hitIndex].y,
        duration: ANI_TIME,
      })
    }

    Draggable.create(element, {
      onDrag: onDrag,
      onPress: onPress,
      onRelease: onRelease,
      cursor: option.cursor || 'default',
      type: option.type || 'x,y',
      bounds: option.bounds || target,
    })[0]
  }

  return {}
}
