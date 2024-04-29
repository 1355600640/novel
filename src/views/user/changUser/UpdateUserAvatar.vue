<template>
  <div id="update-user-avatar">
    <div class="user-photo">
      <div class="center-photo">
        <div class="local-image" v-show="!pageData.isUpload">
          <div class="select-button" @click="openUpload">选择本地文件</div>
          <input
            @change="fileChange"
            ref="upload"
            class="upload"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
          />
          <div class="select-button" @click="setUserAvatarToDefalut">
            选择默认头像
          </div>
        </div>
        <div
          @wheel="uploadImageMouse"
          class="upload-image"
          v-show="pageData.isUpload"
        >
          <img src="" class="user-of-upload" ref="userUpload" alt="" />
          <img src="" alt="" class="upload-back" ref="uploadBack" />
          <div
            @mousedown="selectBoxDown"
            @mouseup="selectMouseUp"
            class="select-box"
          >
            <div class="select-center-box">
              <img class="select-box-img" src="" alt="" />
            </div>
            <div class="select-border">
              <div
                v-for="index in 4"
                :key="index"
                :class="`border-line line-${index}`"
                @mousedown="selectBorderDown(index, 'line', $event)"
              ></div>
              <div
                v-for="index in 8"
                :key="index"
                :class="`select-point-${index} select-point`"
                @mousedown="selectBorderDown(index, 'pointer', $event)"
              ></div>
            </div>
            <span class="select-box-size"
              >{{ pageData.boxSizeW }}*{{ pageData.boxSizeH }}</span
            >
          </div>
          <div
            @mousedown="initializeMovePosition"
            class="upload-drag-box"
          ></div>
        </div>
        <div
          @click="openUpload"
          class="reload-upload"
          v-show="pageData.isUpload"
        >
          重新选择 <icon-refresh />
        </div>
      </div>
      <div class="user-photo-operate">
        <div class="user-big-head">
          <div class="user-big-head-cente">
            <img
              :class="{ 'select-big-head': pageData.isUpload }"
              ref="bigHead"
              :src="
                store.mainImage +
                `/user/${
                  seletDefalut ? 'default-avatar.jpg' : 'default_people.gif'
                }`
              "
              alt=""
            />
          </div>

          <div>大头像尺寸：120*120像素</div>
        </div>
        <div class="user-small-head">
          <div class="user-small-head-center">
            <img
              :class="{ 'select-small-head': pageData.isUpload }"
              ref="smallHead"
              :src="
                store.mainImage +
                `/user/${
                  seletDefalut ? 'default-avatar.jpg' : 'default_people.gif'
                }`
              "
              alt=""
            />
          </div>
          <div>小头像尺寸：40*40像素</div>
        </div>
      </div>
    </div>
    <div class="upload-operate">
      <div class="upload-operate-title">
        支持JPG,JPEG,PNG等格式，最大不超过3M
      </div>
      <button
        @click="uploadImage"
        :class="{
          'forbidden-upload-button': !pageData.isUpload && !haveDefalut,
        }"
        class="upload-operate-button"
      >
        保存头像
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { mainStore } from '../../../store'
import { storeToRefs } from 'pinia'
import { ref, onMounted, onBeforeMount } from 'vue'
import { fileToBlob } from '../../../utils/commonUtils'
import {
  updateUserInfo,
  updateUserAvatar,
  userInfoDto,
} from '../../../api/User'
import router from '../../../router'
let store = mainStore()
let { user } = storeToRefs(store)
let from = ref(user)
let seletDefalut = ref(false)
let haveDefalut = ref(false)
let upload = ref<HTMLInputElement>()
let smallHead = ref<HTMLImageElement>()
let bigHead = ref<HTMLImageElement>()
let userUpload = ref<HTMLImageElement>()
let pageData = ref({
  isUpload: false,
  moveSelectBox: false,
  changeSelectSize: false,
  changeSelectSizeWay: '',
  changeSelectSizeIndex: 0,
  boxSizeW: 120,
  boxSizeH: 120,
  startX: 0,
  startY: 0,
  moveX: 0,
  moveY: 0,
  maxW: 130,
  minW: 10,
  startW: 120,
  moveImage: false,
  lastMove: {
    startX: 0,
    startY: 0,
    moveX: 0,
    moveY: 0,
  },
  lastMouse: {
    startX: 0,
    startY: 0,
    nowScale: 1,
  },
  startBigW: 0,
  startSmallW: 0,
  selectMouse: {
    startX: 0,
    startY: 0,
  },
  backImagePosition: {
    startX: 0,
    startY: 0,
  },
  imageWidth: 1,
  fileName: '',
})

const openUpload = () => {
  upload.value?.click()
}

/**
 * 选择文件事件
 * @param e 事件
 */
const fileChange = () => {
  if (upload.value?.files)
    fileToBlob(upload.value?.files[0]).then((file: Blob) => {
      const fileType = ['jpg', 'jpeg', 'png']
      let isType = false
      fileType.forEach((item) => {
        if (file.type.includes(item)) {
          isType = true
        }
      })
      if (!isType) {
        Message.error('请选择合适的文件类型')
        return
      }
      if (file.size / 1048576 > 3) {
        Message.error('文件过大')
        return
      }
      let url = URL.createObjectURL(file as Blob)
      seletDefalut.value = false
      //初始化值
      pageData.value = {
        isUpload: true,
        moveSelectBox: false,
        changeSelectSize: false,
        changeSelectSizeWay: '',
        changeSelectSizeIndex: 0,
        boxSizeW: 120,
        boxSizeH: 120,
        startX: 0,
        startY: 0,
        moveX: 0,
        moveY: 0,
        maxW: 130,
        minW: 10,
        startW: 120,
        moveImage: false,
        lastMove: {
          startX: 0,
          startY: 0,
          moveX: 0,
          moveY: 0,
        },
        lastMouse: {
          startX: 0,
          startY: 0,
          nowScale: 1,
        },
        startBigW: 0,
        startSmallW: 0,
        selectMouse: {
          startX: 0,
          startY: 0,
        },
        backImagePosition: {
          startX: 0,
          startY: 0,
        },
        imageWidth: 1,
        fileName: '',
      }
      pageData.value.fileName = upload.value?.files![0].name || ''
      const boxSize = document.querySelector('.select-box') as HTMLElement
      boxSize!.style.height = pageData.value.boxSizeH + 'px'
      boxSize!.style.width = pageData.value.boxSizeW + 'px'
      setTimeout(() => {
        userUpload.value!.src = url
        bigHead.value!.src = url
        smallHead.value!.src = url
        drawBackground()
        const selectBoxImg = document.querySelector(
          '.select-box-img'
        ) as HTMLImageElement

        // 设置选择框位置
        const uploadImage = (
          document.querySelector('.upload-image') as HTMLElement
        ).getBoundingClientRect()
        selectBoxImg.src = url
        selectBoxImg.style.width = uploadImage.width + 'px'
        selectBoxImg.style.height = uploadImage.width + 'px'
        // 设置图片位置
        setImagePosition()
      }, 0)
    })
}

/**
 * 设置各个图片位置
 */
const setImagePosition = () => {
  const selectImg = document.querySelector('.select-box-img') as HTMLElement,
    bigImg = document
      .querySelector('.user-big-head-cente')!
      .querySelector('img') as HTMLElement,
    smallImg = document
      .querySelector('.user-small-head-center')!
      .querySelector('img') as HTMLElement,
    backImage = userUpload.value as HTMLImageElement
  selectImg.style.transform = `scale(1,1) translate3d(0px,0px, 0px) rotateZ(0deg)`
  bigImg.style.transform = `scale(1,1) translate3d(0px,0px, 0px) rotateZ(0deg)`
  smallImg.style.transform = `scale(1,1) translate3d(0px,0px, 0px) rotateZ(0deg)`
  backImage.style.transform = `scale(1,1) translate3d(0px,0px, 0px) rotateZ(0deg)`
  const bigImage = document.querySelector('.select-big-head') as HTMLElement,
    smallImage = document.querySelector('.select-small-head') as HTMLElement
  pageData.value.startBigW = bigImage!.getBoundingClientRect().width
  pageData.value.startSmallW = smallImage!.getBoundingClientRect().width
  selectBoxMove()
}

let uploadBack = ref<HTMLImageElement>()
/**
 * 创建马赛克背景
 * 创建选择框
 */
const drawBackground = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 20
  canvas.height = 20
  let ctx = canvas.getContext('2d')
  ctx!.fillStyle = '#cccccc'
  //绘制矩形
  ctx!.fillRect(10, 0, 10, 10)
  ctx!.fillStyle = '#cccccc'
  ctx!.fillRect(0, 10, 10, 10)
  let dataUrl = canvas.toDataURL()

  uploadBack.value!.style.background = `url(${dataUrl})`
  // 设置选择框大小 和初始位置
  const selectBox = document.querySelector('.select-box') as HTMLElement
  const uploadImage = document.querySelector('.upload-image') as HTMLElement
  selectBox.style.transform = `translate3d(${
    (uploadImage.getBoundingClientRect().width - 120) / 2
  }px, ${(uploadImage.getBoundingClientRect().width - 120) / 2}px, 0px)`
}

/**
 * 鼠标滚动头像放大/缩小
 * @param event 事件
 */
const uploadImageMouse = (event: WheelEvent) => {
  let deltaY = event.deltaY || -event.detail
  event.preventDefault()
  imageChangeSize(!(deltaY > 0))
  return false
}

/**
 * 实现鼠标滚动头像放大/缩小
 */
let lastTime = 0
const imageChangeSize = (upOrSmall: boolean, renderBox?: boolean) => {
  let nowTime = 0
  let changeMagnification = pageData.value.startW / pageData.value.boxSizeW - 1
  if (pageData.value.imageWidth >= 5) {
    return
  }
  if (lastTime != 0) {
    nowTime = Date.now() - lastTime
  }
  if (lastTime == 0 || nowTime > 10) {
    const selectBoxImg = document.querySelector(
      '.select-box-img'
    ) as HTMLElement
    if (!renderBox) {
      if (!upOrSmall) {
        if (pageData.value.imageWidth > 2 / 6)
          pageData.value.imageWidth -= 1 / 6
      } else pageData.value.imageWidth += 1 / 6
    }
    smallHead.value!.style.transform = moveOrScale(
      smallHead.value!.style.transform,
      'scale',
      pageData.value.imageWidth + changeMagnification + '',
      pageData.value.imageWidth + changeMagnification + ''
    )

    bigHead.value!.style.transform = moveOrScale(
      bigHead.value!.style.transform,
      'scale',
      pageData.value.imageWidth + changeMagnification + '',
      pageData.value.imageWidth + changeMagnification + ''
    )
    if (!renderBox) {
      userUpload.value!.style.transform = moveOrScale(
        userUpload.value!.style.transform,
        'scale',
        pageData.value.imageWidth + '',
        pageData.value.imageWidth + ''
      )
      pageData.value.lastMouse.nowScale = pageData.value.imageWidth
      selectBoxImg.style.transform = moveOrScale(
        selectBoxImg!.style.transform,
        'scale',
        pageData.value.imageWidth + '',
        pageData.value.imageWidth + ''
      )
    }
    selectBoxMove()
    lastTime = Date.now()
  }
}

/**
 * 在选择框按下时设置初始鼠标位置
 * @param e 事件
 */
const selectBoxDown = (e: MouseEvent) => {
  pageData.value.moveSelectBox = true
  pageData.value.lastMouse.startX = e.clientX
  pageData.value.lastMouse.startY = e.clientY
}

/**
 * 拖动移动框设置目标区域
 * @param e 事件
 */
const selectBoxMove = (
  e?: MouseEvent,
  renderPosition?: 'x' | 'y',
  renderDistance?: number
) => {
  if (
    ((e && (!pageData.value.moveSelectBox || e.buttons != 1)) ||
      pageData.value.changeSelectSize == true) &&
    !renderDistance
  ) {
    pageData.value.moveSelectBox = false
    return
  }
  let distanceX = 0,
    distanceY = 0
  if (e) {
    ;(distanceX = e.clientX - pageData.value.lastMouse.startX),
      (distanceY = e.clientY - pageData.value.lastMouse.startY)
  }

  const selectBox = document.querySelector('.select-box') as HTMLElement,
    selectBoxImg = document.querySelector('.select-box-img') as HTMLElement,
    uploadImage = document.querySelector('.upload-image') as HTMLElement
  // 最大头像移动尺寸
  let maxMoveX =
      uploadImage.getBoundingClientRect().width -
      selectBox.getBoundingClientRect().width,
    maxMoveY =
      uploadImage.getBoundingClientRect().height -
      selectBox.getBoundingClientRect().height
  let boxMoveX =
      selectBox.getBoundingClientRect().x -
      uploadImage.getBoundingClientRect().x,
    boxMoveY =
      selectBox.getBoundingClientRect().y -
      uploadImage.getBoundingClientRect().y
  let moveX = boxMoveX + distanceX
  let moveY = boxMoveY + distanceY
  if (renderPosition == 'x') {
    moveX += renderDistance || 0
  } else if (renderPosition == 'y') {
    moveY += renderDistance || 0
  }

  moveX = moveX < 0 ? 0 : moveX > maxMoveX ? maxMoveX : moveX
  moveY = moveY < 0 ? 0 : moveY > maxMoveY ? maxMoveY : moveY
  // 设置移动框位置和和移动框中图片位置
  selectBox.style.transform = moveOrScale(
    selectBox.style.transform,
    'translate3d',
    moveX + 'px',
    moveY + 'px',
    '0px'
  )
  pageData.value.backImagePosition = {
    startX: moveX,
    startY: moveY,
  }
  // 上层图片
  selectBoxImg.style.transform = moveOrScale(
    selectBoxImg.style.transform,
    'translate3d',
    -moveX / pageData.value.lastMouse.nowScale +
      pageData.value.lastMove.startX +
      'px',
    -moveY / pageData.value.lastMouse.nowScale +
      pageData.value.lastMove.startY +
      'px',
    '0px'
  )
  // 移动大头像框
  moveBigHead(-moveX, -moveY, maxMoveX, maxMoveY)
  // 移动小头像框
  moveSmallHead(-moveX, -moveY, maxMoveX, maxMoveY)
  if (e) {
    pageData.value.lastMouse.startX = e.clientX
    pageData.value.lastMouse.startY = e.clientY
  }
  // 判断字符空间
  const boxSize = document.querySelector('.select-box-size') as HTMLElement
  if (
    selectBox.getBoundingClientRect().y -
      uploadImage.getBoundingClientRect().y <
    boxSize.getBoundingClientRect().height
  ) {
    boxSize.style.transform = `translate(0px, 0)`
  } else {
    boxSize.style.transform = `translate(0px, -100%)`
  }
}

/**
 * 松开鼠标事件
 */
const selectMouseUp = () => {
  pageData.value.moveSelectBox = false
  pageData.value.changeSelectSize = false
  pageData.value.moveImage = false
}

/**
 * 改变选择框大小
 * @param e 事件
 */
const changeSelectBoxSize = (e: MouseEvent) => {
  e.preventDefault()
  let move = 0
  let maxW = pageData.value.maxW,
    minW = pageData.value.minW
  if (!pageData.value.changeSelectSize) return
  const boxSize = document.querySelector('.select-box') as HTMLElement,
    uploadBox = document.querySelector('.upload-image') as HTMLElement
  let maxW2 =
    uploadBox.getBoundingClientRect().x +
    uploadBox.getBoundingClientRect().width -
    boxSize.getBoundingClientRect().x -
    boxSize.getBoundingClientRect().width
  let maxW3 =
    uploadBox.getBoundingClientRect().y +
    uploadBox.getBoundingClientRect().height -
    boxSize.getBoundingClientRect().y -
    boxSize.getBoundingClientRect().height
  let maxW4 = maxW2 > maxW3 ? maxW3 : maxW2

  const topPointer = [1, 2],
    leftPointer = [3, 5],
    rightPointer = [4, 6],
    bottomPointer = [7, 8]
  let way = pageData.value.changeSelectSizeWay,
    index = pageData.value.changeSelectSizeIndex,
    upOrDown = 1

  if (
    (way == 'line' && (index == 1 || index == 2)) ||
    (way == 'pointer' && (topPointer.includes(index) || index == 6))
  ) {
    upOrDown = -1
  }
  if (
    (way == 'line' && index % 2 == 1) ||
    (way == 'pointer' &&
      (topPointer.includes(index) || bottomPointer.includes(index)))
  ) {
    move = e.clientY - pageData.value.selectMouse.startY
  } else if (
    (way == 'line' && index % 2 == 0) ||
    (way == 'pointer' &&
      (leftPointer.includes(index) || rightPointer.includes(index)))
  ) {
    move = e.clientX - pageData.value.selectMouse.startX
  }

  move *= upOrDown
  if (move > maxW4) return
  pageData.value.boxSizeH += move
  pageData.value.boxSizeW += move
  if (pageData.value.boxSizeH >= minW && pageData.value.boxSizeH <= maxW) {
    if (
      (way == 'line' && index == 1) ||
      (way == 'pointer' && bottomPointer.includes(index))
    ) {
      pageData.value.startY = move
      selectBoxMove(undefined, 'y', -move)
    } else if (
      ((way == 'line' && index == 3) ||
        (way == 'pointer' && leftPointer.includes(index))) &&
      pageData.value.startY < 0
    ) {
      pageData.value.startY -= move
      selectBoxMove(undefined, 'y', move)
    } else if (
      (way == 'line' && index == 2) ||
      (way == 'pointer' && rightPointer.includes(index))
    ) {
      pageData.value.startX -= move
      selectBoxMove(undefined, 'x', -move)
    } else if (
      ((way == 'line' && index == 4) ||
        (way == 'pointer' && topPointer.includes(index))) &&
      pageData.value.startX < 0
    ) {
      pageData.value.startX += move
      selectBoxMove(undefined, 'x', move)
    }
  }
  imageChangeSize(false, true)
  // 超出界限回归
  pageData.value.boxSizeH =
    pageData.value.boxSizeH >= maxW
      ? maxW
      : pageData.value.boxSizeH < minW
      ? minW
      : pageData.value.boxSizeH
  pageData.value.boxSizeW =
    pageData.value.boxSizeW >= maxW
      ? maxW
      : pageData.value.boxSizeW < minW
      ? minW
      : pageData.value.boxSizeW
  pageData.value.selectMouse.startX = e.clientX
  pageData.value.selectMouse.startY = e.clientY
  boxSize!.style.height = pageData.value.boxSizeH + 'px'
  boxSize!.style.width = pageData.value.boxSizeW + 'px'
}

/**
 * 初始化图片移动位置
 * @param e 鼠标事件
 */
const initializeMovePosition = (e: MouseEvent) => {
  pageData.value.lastMove.moveX = e.clientX
  pageData.value.lastMove.moveY = e.clientY
  pageData.value.moveImage = true
}

/**
 * 在上传框(在选择框外)移动移动图片位置
 * @param e 鼠标事件
 */
const moveImagePosition = (e: MouseEvent) => {
  if (!pageData.value.moveImage) return
  const backImage = document.querySelector('.user-of-upload') as HTMLElement
  pageData.value.lastMove.startX -= pageData.value.lastMove.moveX - e.clientX
  pageData.value.lastMove.startY -= pageData.value.lastMove.moveY - e.clientY
  pageData.value.lastMove.moveX = e.clientX
  pageData.value.lastMove.moveY = e.clientY
  backImage!.style.transform = moveOrScale(
    backImage!.style.transform,
    'translate3d',
    pageData.value.lastMove.startX + 'px',
    pageData.value.lastMove.startY + 'px',
    '0px'
  )

  selectBoxMove()
}

/**
 * 根据使用选择框线/点进行改选择框的大小
 */
const selectBorderDown = (
  index: number,
  way: 'line' | 'pointer',
  e: MouseEvent
) => {
  if (e.buttons != 1) return
  pageData.value.selectMouse.startX = e.clientX
  pageData.value.selectMouse.startY = e.clientY
  pageData.value.changeSelectSize = true
  pageData.value.changeSelectSizeIndex = index
  pageData.value.changeSelectSizeWay = way
}

// 移动120*120尺寸头像框
const moveBigHead = (
  moveX: number,
  moveY: number,
  maxMoveX: number,
  maxMoveY: number
) => {
  const father = document.querySelector('.user-big-head-cente'),
    bigHeadImg = father?.querySelector('img'),
    uploadBox = document.querySelector('.upload-image')
  // 缩放选择框,改变图片的放大倍率
  let changeMagnification = pageData.value.startW / pageData.value.boxSizeW
  // 放大倍率改变时,图片初始位置改变
  let additional =
      (pageData.value.startBigW * (changeMagnification - 1)) /
      2 /
      changeMagnification,
    boxMagnification =
      pageData.value.startBigW / uploadBox!.getBoundingClientRect().width
  bigHeadImg!.style.transform = moveOrScale(
    bigHeadImg!.style.transform,
    'translate3d',
    Math.floor((moveX + pageData.value.lastMove.startX) * boxMagnification) /
      changeMagnification /
      pageData.value.lastMouse.nowScale +
      additional * ((maxMoveX + moveX) / maxMoveX) +
      'px',
    Math.floor((moveY + pageData.value.lastMove.startY) * boxMagnification) /
      changeMagnification /
      pageData.value.lastMouse.nowScale +
      additional * ((maxMoveY + moveY) / maxMoveY) +
      'px',
    '0px'
  )
}

// 移动40*40头像框尺寸
const moveSmallHead = (
  moveX: number,
  moveY: number,
  maxMoveX: number,
  maxMoveY: number
) => {
  const father = document.querySelector('.user-small-head-center'),
    smallHeadImg = father?.querySelector('img'),
    uploadBox = document.querySelector('.upload-image')
  // 放大倍率
  let changeMagnification = pageData.value.startW / pageData.value.boxSizeW
  // 放大倍率改变时,图片初始位置改变
  let additional =
      (pageData.value.startSmallW * (changeMagnification - 1)) /
      2 /
      changeMagnification,
    boxMagnification =
      pageData.value.startSmallW / uploadBox!.getBoundingClientRect().width
  smallHeadImg!.style.transform = moveOrScale(
    smallHeadImg!.style.transform,
    'translate3d',
    Math.floor(boxMagnification * (moveX + pageData.value.lastMove.startX)) /
      changeMagnification /
      pageData.value.lastMouse.nowScale +
      additional * ((maxMoveX + moveX) / maxMoveX) +
      'px',
    Math.floor(boxMagnification * (moveY + pageData.value.lastMove.startY)) /
      changeMagnification /
      pageData.value.lastMouse.nowScale +
      additional * ((maxMoveY + moveY) / maxMoveY) +
      'px',
    '0px'
  )
}

/**
 * 移动/缩放/全部
 */
const moveOrScale = (
  statement: string,
  way: 'translate3d' | 'scale' | 'all',
  ...data: string[]
) => {
  let patter
  if (way == 'translate3d' || way === 'all') {
    patter = /translate3d\(.*?\)/
  }
  if (way === 'scale' || way === 'all') {
    patter = /scale\(.*?\)/
  }
  return statement.replace(patter as RegExp, `${way}(${data.join(',')})`)
}

/**
 * 设置用户头像为默认
 */
const setUserAvatarToDefalut = () => {
  if (!from.value.userPhoto.includes('default-avatar.jpg')) {
    haveDefalut.value = true
  }
  seletDefalut.value = true
}

/**
 * 上传图片
 */
const uploadImage = () => {
  if (!pageData.value.isUpload && !haveDefalut) return
  // 设置默认头像
  if (haveDefalut.value) {
    let user = JSON.parse(JSON.stringify(store.user)) as userInfoDto
    user.userPhoto = '/user/default-avatar.jpg'
    updateUserInfo(user).then((r) => {
      if (r.data.status == 200) {
        Message.success('修改成功')
        store.getUser()
        setTimeout(() => {
          router.push('/user')
        }, 200)
      } else {
        Message.error('修改失败')
      }
    })
    return
  }
  let canvasW = 178,
    canvasH = 178
  const canvas = new OffscreenCanvas(canvasW, canvasH),
    backImage = userUpload.value as HTMLImageElement,
    selectBox = (
      document.querySelector('.select-center-box') as HTMLElement
    ).getBoundingClientRect(),
    selectBoxImage = (
      document.querySelector('.select-box-img') as HTMLElement
    ).getBoundingClientRect()

  canvas.width = canvasW
  canvas.height = canvasH
  let ctx = canvas.getContext('2d')
  // 将上传图片画在canvas，并初始化位置
  const scaleW = backImage.naturalWidth / backImage.width,
    scaleY = backImage.naturalHeight / backImage.height
  let positionX =
      ((selectBox.x - selectBoxImage.x) * scaleW) / pageData.value.imageWidth,
    positionY =
      ((selectBox.y - selectBoxImage.y) * scaleY) / pageData.value.imageWidth,
    tailorX = (pageData.value.boxSizeW * scaleW) / pageData.value.imageWidth,
    tailorY = (pageData.value.boxSizeH * scaleY) / pageData.value.imageWidth,
    sizeW =
      canvasW *
      (canvasW * pageData.value.imageWidth < pageData.value.boxSizeW
        ? (canvasW * pageData.value.imageWidth) / pageData.value.boxSizeW
        : 1),
    sizeH =
      canvasH *
      (canvasH * pageData.value.imageWidth < pageData.value.boxSizeH
        ? (canvasH * pageData.value.imageWidth) / pageData.value.boxSizeH
        : 1),
    rightX =
      selectBox.x + selectBox.width - (selectBoxImage.x + selectBoxImage.width),
    rightY =
      selectBox.y +
      selectBox.height -
      (selectBoxImage.y + selectBoxImage.height)
  rightX = rightX < 0 ? 0 : rightX
  rightY = rightY < 0 ? 0 : rightY
  tailorX =
    tailorX + positionX > backImage.naturalWidth
      ? backImage.naturalWidth - positionX
      : tailorX
  tailorY =
    tailorY + positionY > backImage.naturalHeight
      ? backImage.naturalHeight - positionY
      : tailorY
  ctx?.drawImage(
    backImage,
    positionX > 0 ? positionX : 0,
    positionY > 0 ? positionY : 0,
    tailorX,
    tailorY,
    (canvasW - sizeW) / 2 + (positionX > 0 ? 0 : (positionX / scaleW) * -1),
    (canvasH - sizeH) / 2 + (positionY > 0 ? 0 : (positionY / scaleY) * -1),
    sizeW - rightX,
    sizeH - rightY
  )
  const blob = canvas.convertToBlob({ type: 'image/png' })
  blob.then((r) => {
    let file = new File([r], pageData.value.fileName, { type: r.type })
    updateUserAvatar(file).then((r) => {
      if (r.data.status == 200) {
        Message.success('修改成功')
        store.getUser()
        setTimeout(() => {
          router.push('/user')
        }, 200)
      } else {
        Message.error('修改失败')
      }
    })
  })
}
onMounted(() => {
  window.addEventListener('mousemove', selectBoxMove)
  window.addEventListener('mousemove', changeSelectBoxSize)
  window.addEventListener('mousemove', moveImagePosition)
  window.addEventListener('mouseup', selectMouseUp)
})
onBeforeMount(() => {
  window.removeEventListener('mousemove', selectBoxMove)
  window.removeEventListener('mousemove', changeSelectBoxSize)
  window.removeEventListener('mousemove', moveImagePosition)
  window.removeEventListener('mouseup', selectMouseUp)
})
</script>
<style lang="scss" scoped>
#update-user-avatar {
  .user-photo {
    display: flex;
    justify-content: center;
    padding: 144px 0 88px;
    $uploadW: 178;
    $selectBoxW: 120;

    .center-photo {
      display: flex;
      justify-content: center;
      align-items: center;
      user-select: none;
      display: flex;
      flex-direction: column;
      gap: 20px;

      .local-image {
        display: flex;
        gap: 20px;
        flex-direction: column;
        .upload {
          width: 0;
          height: 0;
        }
        .select-button {
          background: #fff;
          border: 1px solid #dcdddf;
          border-radius: 8px;
          color: #333;
          line-height: 70px;
          font-size: 16px;
          width: 178px;
          text-align: center;
          cursor: pointer;
          &:hover {
            color: rgb(var(--qing-color));
            border-color: rgb(var(--qing-color));
          }
        }
      }

      .upload-image {
        position: relative;
        width: calc($uploadW * 1px);
        height: calc($uploadW * 1px);
        cursor: all-scroll !important;
        overflow: hidden;
        border-radius: 12px;

        .user-of-upload {
          position: relative;
          z-index: 10;
          width: 100%;
          height: 100%;
        }
        .upload-back {
          // z-index: 10;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
        .select-box {
          cursor: all-scroll !important;
          position: absolute;
          width: calc($selectBoxW * 1px);
          height: calc($selectBoxW * 1px);
          top: 0;
          left: 0;
          z-index: 30;
          background-size: $uploadW $uploadW;
          border: 1px solid rgb(var(--qing-color));
          &:hover {
            cursor: all-scroll;
          }
          .select-center-box {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;

            .select-box-img {
              max-width: none;
              position: absolute;
              cursor: all-scroll !important;
              left: 0;
              top: 0;
              user-select: none;
              draggable: false;
              -webkit-user-drag: none;
              &:active {
                cursor: all-scroll;
              }
            }
          }

          .select-border {
            $lineW: 8px;
            .border-line {
              position: absolute;
              z-index: 21;
              &:nth-child(2n) {
                height: 100%;
                width: $lineW;
              }
              &:nth-child(2n + 1) {
                width: 100%;
                height: $lineW;
              }
            }
            $linePad: 3px;
            .line-1 {
              cursor: n-resize;
              top: calc($lineW / -2);
              left: 0;
            }
            .line-2 {
              cursor: w-resize;
              left: calc($lineW / -2);
              top: 0;
            }
            .line-3 {
              cursor: s-resize;
              bottom: calc($lineW / -2);
              left: 0;
            }
            .line-4 {
              cursor: e-resize;
              top: 0;
              right: calc($lineW / -2);
            }
            > .select-point {
              position: absolute;
              height: 8px;
              width: 8px;
              border-radius: 50%;
              background: rgb(var(--qing-color));
            }
            @for $i from 1 through 3 {
              .select-point-#{$i} {
                top: 0;
                left: calc(calc($i - 1) * 50%);
                transform: translate(-50%, -50%);
              }
            }
            @for $i from 4 through 5 {
              .select-point-#{$i} {
                top: 50%;
                left: calc(calc($i - 4) * 100%);
                transform: translate(-50%, -50%);
              }
            }
            @for $i from 6 through 8 {
              .select-point-#{$i} {
                bottom: 0;
                left: calc(calc($i - 6) * 50%);
                transform: translate(-50%, 50%);
              }
            }
            .select-point-1 {
              cursor: nw-resize;
              z-index: 22;
            }
            .select-point-3 {
              cursor: ne-resize;
              z-index: 22;
            }
            .select-point-6 {
              cursor: sw-resize;
              z-index: 22;
            }
            .select-point-8 {
              cursor: se-resize;
              z-index: 22;
            }
          }
          .select-box-size {
            position: absolute;
            top: -2px;
            left: 4px;
            transform: translate(0, -100%);
            background-color: rgba(0, 0, 0, 0.5);
            font-size: 12px;
            color: white;
          }
          .select-box-size-in {
            background-color: rgba(0, 0, 0, 0.5);
            transform: translate(0, 100%) !important;
          }
        }
        .upload-drag-box {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 20;
        }
      }
      .reload-upload {
        font-size: 13px;
        color: #666;
        cursor: pointer;
      }
    }
    .user-photo-operate {
      display: flex;
      margin-left: 80px;
      gap: 80px;
      border-left: 1px solid #ececec;
      padding-left: 80px;
      > div {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;

        > div {
          font-size: 11px;
          color: #999;
        }
      }

      .user-big-head {
        .user-big-head-cente {
          $bigBoxW: 120px;
          width: $bigBoxW;
          height: $bigBoxW;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #dcdddf;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            max-width: none;
            // transform-origin: left top;
          }
          .select-big-head {
            position: absolute;
            position: absolute;
            left: 0;
            top: 0;
            $bigHeadW: $uploadW/$selectBoxW * $bigBoxW;
            width: calc($bigHeadW);
            height: calc($bigHeadW);
            // transform: translate(50%, 50%);
          }
        }
      }
      .user-small-head {
        gap: 0;
        .user-small-head-center {
          $smallBoxW: 40px;
          border: 1px solid #dcdddf;
          width: $smallBoxW;
          height: $smallBoxW;
          border-radius: 50%;
          overflow: hidden;
          margin-top: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            max-width: none;
            //transform-origin: left top;
          }
          .select-small-head {
            position: absolute;
            left: 0;
            top: 0;
            $smallHeadW: $uploadW / $selectBoxW * $smallBoxW;
            width: calc($smallHeadW);
            height: calc($smallHeadW);
            // transform: translate(50%, 50%);
          }
        }
      }
    }
  }
  .upload-operate {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    .upload-operate-title {
      font-size: 12px;
      color: #666;
    }
    .upload-operate-button {
      color: white;
      width: 164px;
      line-height: 42px;
      border-radius: 12px;
      background: linear-gradient(320deg, rgb(var(--qing-color)), skyblue);
      transform: all 0.3s ease;
    }
    .forbidden-upload-button {
      cursor: not-allowed;
      background: linear-gradient(
        320deg,
        rgb(100 100 100 / 96%),
        rgb(180 180 180)
      );
    }
  }
}
</style>
