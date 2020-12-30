<template>
    <div>
        <remote-js src="https://at.alicdn.com/t/font_562572_1ybmlb5d2a7fd2t9.js"></remote-js>
        <canvas id="canvas"></canvas>
        <div id="options">
            <ul id="color" class="active">
                <li id="black" class="active"></li>
                <li id="red"></li>
                <li id="green"></li>
                <li id="blue"></li>
            </ul>
            <ul id="thickness" class="active">
                <li id="thin" class="active"></li>
                <li id="middle"></li>
                <li id="thick"></li>
            </ul>
            <ul id="actions">
                <li>
                    <svg id="pen" class="active">
                        <use xlink:href="#icon-pen"></use>
                    </svg>
                </li>
                <li>
                    <svg id="eraser">
                        <use xlink:href="#icon-eraser"></use>
                    </svg>
                </li>
                <li>
                    <svg id="clearall">
                        <use xlink:href="#icon-clearall"></use>
                    </svg>
                </li>
                <li>
                    <svg id="save">
                        <use xlink:href="#icon-save"></use>
                    </svg>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    components: {
        'remote-js': {
            render(createElement) {
              return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});            
            },
            props: {
                src: { type: String, required: true },
            },
        },
    },
    data() {
        return {
            canvas: null,
            ctx: null,
            eraserEnabled: false,
            pen: null,
            eraser: null,
            color: null,
            thickness: null,
            actions: null,
        }
    },
    mounted() {
        document.body.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, {passive: false});
        //1. 初始化数据
        this.canvas = document.getElementById("canvas")
        this.ctx = canvas.getContext('2d')
        this.eraserEnabled = false
        this.pen = document.getElementById("pen")
        this.eraser = document.getElementById("eraser")
        this.color = document.getElementById("color")
        this.thickness = document.getElementById("thickness")
        this.actions = document.getElementById("actions")
        //2. 设置画布自动布满视口
        this.autoSetCanvasSize(this.canvas)
        //3. 执行用户动作
        this.painting(this.canvas)
        this.color.addEventListener('click', this.changeColor)
        this.thickness.addEventListener('click', this.changeThickness)
        this.actions.addEventListener('click', (e) => {
            if (e.target.tagName === 'svg') {
                this.takeAction(e.target.id)
            } else if (e.target.tagName === 'use') {
                this.takeAction(e.target.parentElement.id)
            } else if (e.target.tagName === 'LI') {
                this.takeAction(e.target.children[0].id)
            }
        })
    },
    methods: {
        /* 自动调整画布宽高 */
        autoSetCanvasSize(canvas) {
            this.setCanvasSize(canvas)
            window.onresize = () => {
                this.setCanvasSize(canvas)
            }
            this.setCanvasSize(canvas)
        },
        //设置画布宽高
        setCanvasSize(canvas) {
            let pageWidth = document.documentElement.clientWidth
            let pageHeight = document.documentElement.clientHeight
            canvas.width = pageWidth
            canvas.height = pageHeight
        },
        /* 绘制操作 */
        painting(canvas) {
            this.ctx.strokeStyle = "black"
            this.ctx.fillStyle = "black"
            this.ctx.lineWidth = 2
            this.ctx.radius = 1
            let isUsing = false        //是否正在使用
            let previousPoint = {}
            //特性检测
            if (document.body.ontouchstart !== undefined) {
                //触屏设备
                canvas.addEventListener('touchstart', this.touchStart.bind(null, previousPoint))
                canvas.addEventListener('touchmove', this.touchMove.bind(null, previousPoint))
                canvas.addEventListener('touchcancel', this.touchCancel)
            }
            else {
                //PC设备
                canvas.onmousedown = (e) => {
                isUsing = true
                let x = e.clientX
                let y = e.clientY
                if (!this.eraserEnabled) {
                    previousPoint = { x: x, y: y }
                    this.drawPoint(x, y, this.ctx.radius)
                }
                else {
                    this.ctx.clearRect(x - 5, y - 5, 10, 10)
                }
                }
                canvas.onmousemove = (e) => {
                if (isUsing) {
                    let x = e.clientX
                    let y = e.clientY
                    let newPoint = { x: x, y: y }
                    if (!this.eraserEnabled) {
                    this.drawPoint(x, y, this.ctx.radius)
                    this.drawLine(previousPoint.x, previousPoint.y, newPoint.x, newPoint.y)
                    previousPoint = newPoint
                    }
                    else {
                    this.ctx.clearRect(x - 5, y - 5, 10, 10)
                    }
                }
                }
                canvas.onmouseup = () => {
                    isUsing = false
                }
            }
        },
        touchStart(point, e) {
            e.preventDefault()
            let x, y
            for (let touch of e.changedTouches) {
                x = Math.floor(touch.clientX)
                y = Math.floor(touch.clientY)
                if (!this.eraserEnabled) {
                point[touch.identifier] = { x: x, y: y }
                this.drawPoint(x, y, this.ctx.radius)
                } else {
                this.ctx.clearRect(x - 5, y - 5, 10, 10)
                }
            }
        },
        touchMove(originalPoint, e) {
            e.preventDefault()
            let x, y, newPoint = {}
            for (let touch of e.changedTouches) {
                x = Math.floor(touch.clientX)
                y = Math.floor(touch.clientY)
                if (!this.eraserEnabled) {
                newPoint[touch.identifier] = { x: x, y: y }
                this.drawPoint(x, y, this.ctx.radius)           //需要添加此函数才不会使得画出来的线在lineWidth变大时不完整
                this.drawLine(originalPoint[touch.identifier].x, originalPoint[touch.identifier].y, newPoint[touch.identifier].x, newPoint[touch.identifier].y)
                originalPoint[touch.identifier] = newPoint[touch.identifier]
                }
                else {
                this.ctx.clearRect(x - 8, y - 8, 16, 16)
                }
            }
        },
        touchCancel() {
            alert("Oops! 是不是你的第六个小指头打断了画画~ !!(•'╻'•)꒳ᵒ꒳ᵎᵎᵎ \n\n乖，听话，最多只能用五个指头哦！")
        },

        /* 选笔触颜色 */
        changeColor(e) {
            let selectedColor = e.target.id
            this.ctx.strokeStyle = selectedColor
            this.ctx.fillStyle = selectedColor
            this.whichActived(selectedColor, 'color')
        },
        /* 选笔触粗细 */
        changeThickness(e) {
            let selectedThickness = e.target.id
            if (selectedThickness === 'thin') {
                this.ctx.lineWidth = 2
                this.ctx.radius = 1
            } else if (selectedThickness === 'middle') {
                this.ctx.lineWidth = 6
                this.ctx.radius = 3
            } else if (selectedThickness === 'thick') {
                this.ctx.lineWidth = 10
                this.ctx.radius = 5
            }
            this.whichActived(selectedThickness, 'thickness')
        },
        whichActived(target, parentID) {
            let parentNode
            if (parentID === 'color') {
                parentNode = this.color
            } else if (parentID === 'thickness') {
                parentNode = this.thickness
            }
            for (let i = 0; i < parentNode.children.length; i++) {
                if (target === parentNode.children[i].id) {
                parentNode.children[i].className = "active"
                } else if (target !== parentID) {
                parentNode.children[i].className = ""
                }
            }
        },
        /* 画圆点 */
        drawPoint(x, y, radius) {
            this.ctx.beginPath()
            this.ctx.arc(x, y, radius, 0, Math.PI * 2)
            this.ctx.fill()
        },
        /* 画轨迹（线条） */
        drawLine(x1, y1, x2, y2) {
            // 解决IOS中获取不到ctx设置的问题
            if (this.ctx.lineWidth === 1) {
                this.ctx.lineWidth = 2
                this.ctx.radius = 1
            }
            this.ctx.beginPath()
            this.ctx.moveTo(x1, y1)
            this.ctx.lineTo(x2, y2)
            this.ctx.stroke()
        },
        /* 选择哪个动作 */
        takeAction(element) {
            if (element === 'pen') {
                this.eraserEnabled = false
                this.pen.classList.add("active")
                this.eraser.classList.remove("active")
                this.color.className = "active"
                this.thickness.className = "active"
            } else if (element === 'eraser') {
                this.eraserEnabled = true
                this.pen.classList.remove("active")
                this.eraser.classList.add("active")
                this.color.className = "remove"
                this.thickness.className = "remove"
            } else if (element === 'clearall') {
                this.ctx.clearRect(0, 0, canvas.width, canvas.height)    //清屏
                this.eraserEnabled = false
                this.pen.classList.add("active")
                this.eraser.classList.remove("active")
                this.color.className = "active"
                this.thickness.className = "active"
            } else if (element === 'save') {
                let a = document.createElement("a")
                a.href = canvas.toDataURL()           //获得图片地址
                a.target = "_blank"
                a.download = "image.png"
                a.click()
            }
        }
    }
}
</script>
<style scoped>
*{
  margin:0;
  padding:0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
body{
  overflow: hidden;       /*使PC端不出现滚动条*/
}
#canvas{
  position: fixed;        /*使手机端不会因触摸而上下滑动*/
  top:0;
  left: 0;
  background-color: #eee;
}
#options{
  position: fixed;        /*使所有选项在canvas之上，此外也可以用z-index达到同样的效果*/
  top:0;
  right: 0;
  padding: 10px;
}
ul{
  list-style: none;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
li{
  cursor: pointer;
  margin: 4px;
}
ul#actions svg{
  width: 20px;
  height: 20px;
  transition: all 0.2s;
}
ul#actions svg.active{
  transform: scale(1.25);
  fill: red;
}

ul#color > li{
  width: 20px;
  height: 20px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  transition: all 0.2s ease-out;
}
li#black{
  background-color: black;
}
li#red{
  background-color: red;
}
li#green{
  background-color: green;
}
li#blue{
  background-color: blue;
}

ul#thickness > li{
  margin: 6px;
  height: 20px;
  background-color: black;
  box-shadow: 0 0 4px rgba(80, 80, 80, 0.4);
  transition: all 0.2s ease-out;
  position: relative;
}
ul#thickness > li::after{
  content: '';
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: -4px;
  right: -4px;
}
li#thin{
  width: 2px;
}
li#middle{
  width: 6px;
}
li#thick{
  width: 10px;
}
ul#color.remove,
ul#thickness.remove{
  display: none;
}
ul#color.active,
ul#thickness.active{
  animation: active 0.2s;
  transition: all 0.2s;
}
@keyframes active{
  0%{
    display: inline-flex;
    transform: translate(-999px);
  }
  80%{
    transform: translate(10px);
  }
  100%{
    transform: translate(0px);
  }
}
ul#color > li.active,
ul#thickness > li.active{
  transform: scale(1.15);
  box-shadow: 0 0 8px rgba(80, 80, 80, 0.8);
}
</style>