import React, { Component } from 'react'
import RegionSelect from 'react-region-select'

import backBtn from './images/back.png'
import nextBtn from './images/next.png'
import bankaBtn from './images/banka.png'
import momBtn from './images/mom.png'



const ACTIONS = [
  'data-return-back',
  'data-go-to-slide',
  'data-jump-to-seq'
]

const actionHelper = (action) => {
  if(!action) return ''
  if(action.name === ACTIONS[0]) return ACTIONS[0]
  if(action.name === ACTIONS[1]) return `${ACTIONS[1]}="${action.slideName}"`
  if(action.name === ACTIONS[2]) return `${ACTIONS[2]}='{ "seqName": "${action.seqName}", "slideName": "${action.slideName}" }'`
  if(action.name === 'data-pdf') return `data-pdf="${action.pdfName}"`
  return ''
}

const hitBoxesBuilder = (regions) => {
  const SLIDE_WIDTH = 1024
  const SLIDE_HEIGHT = 768

  const _calcDigitFromPercent = (from, percent) => Math.ceil((from * percent) / 100) + 1

  return regions.map(r => {
    const width = _calcDigitFromPercent(SLIDE_WIDTH, r.width)
    const height = _calcDigitFromPercent(SLIDE_HEIGHT, r.height)
    const top = _calcDigitFromPercent(SLIDE_HEIGHT, r.y)
    const left = _calcDigitFromPercent(SLIDE_WIDTH, r.x)

    const style = `width: ${width}px; height: ${height}px; left: ${left}px; top: ${top}px`

    return `<p class="overlay-click-area" style="position: absolute; ${style}" ${actionHelper(r.data)}></p>`
  }).join('\n\t\t\t')
}

const getMarkup = (p) => `
    <!-- * * * * * * * * * * * * START SLIDE * * * * * * * * * * * * -->
    <div class="container" data-slidename="${p.slideName}">
        <img class="full-width-img" src="media/images/${p.img || ''}">

        <div class="inner-container-upper">
            ${hitBoxesBuilder(p.regions)}

            <!-- NAVIGATION PANEL -->
            <div class="absolute-center-x nav-btn-wrap">
                <img ${!p.backBtn.show ? 'hidden' : ''} ${actionHelper(p.backBtn.action)} src="media/images/back.png" class="back-btn">
                <img ${!p.bankaBtn.show ? 'hidden' : ''} ${actionHelper(p.bankaBtn.action)} src="media/images/banka.png">
                <img ${!p.momBtn.show ? 'hidden' : ''} ${actionHelper(p.momBtn.action)} src="media/images/mom.png">
                <img ${!p.nextBtn.show ? 'hidden' : ''} ${actionHelper(p.nextBtn.action)} src="media/images/next.png" class="next-btn">
            </div>
        </div>
    </div>
    <!-- * * * * * * * * * * * * END SLIDE * * * * * * * * * * * * -->
`





class ControlPanelActionItem extends Component {
  goToSlide_slideNameChange(e) {
    this.props.selectAction(this.props.itemName, {
      name: this.props.name,
      slideName: e.target.value.trim()
    })
  }
  
  goToSeqChangeHandler(e) {
    this.props.selectAction(this.props.itemName, {
      name: this.props.name,
      seqName: this.goToSeq_seqName.value.trim(),
      slideName: this.goToSeq_slideName.value.trim()
    })
  }

  firstSelect() {
    this.props.selectAction(this.props.itemName, { name: this.props.name })
  }

  render() {
    const { name, selectAction, targetItem, itemName } = this.props
    const selectedAction = targetItem.action

    console.log(selectedAction)

    return <li onClick={() => this.firstSelect()}>
      { selectedAction && selectedAction.name === name ? <strong>{name}</strong> : <span>{name}</span> }
      { (selectedAction && selectedAction.name === ACTIONS[1] && name === ACTIONS[1]) && <input onChange={this.goToSlide_slideNameChange.bind(this)} placeholder="slide name" defaultValue={selectedAction && selectedAction.slideName} /> }
      { (selectedAction && selectedAction.name === ACTIONS[2] && name === ACTIONS[2]) && <div>
        <input ref={r => this.goToSeq_seqName = r} placeholder="sequence name" defaultValue={selectedAction && selectedAction.seqName} onChange={this.goToSeqChangeHandler.bind(this)}/>
        <input ref={r => this.goToSeq_slideName = r} placeholder="slide name" defaultValue={selectedAction && selectedAction.slideName}  onChange={this.goToSeqChangeHandler.bind(this)}/>
      </div> }
    </li>
  }
}

class ControlPanel extends Component {
  render() {
    const itemName = this.props.controlPanelSelectedItem
    const targetItem = this.props.navPanel[this.props.controlPanelSelectedItem]
  
    return <div className="control-panel" style={{...this.props.position}}>
    <span className="cp-close" onClick={() => this.props.showControlPanel(null)}>&times;</span>
    <p>
      <span className="cp-item">show:</span>
      { targetItem.show ? <span>
        <strong>YES</strong> &nbsp; <span onClick={() => this.props.toggleVisivilityBtn(itemName)}>NO</span>
      </span> : <span>
        <span onClick={() => this.props.toggleVisivilityBtn(itemName)}>YES</span> &nbsp; <strong>NO</strong>
      </span> }
    </p>
    { targetItem.show && <span className="cp-item">action: </span> }
    { targetItem.show && <ul className="cp-actions-list">
      {ACTIONS.map(item => <ControlPanelActionItem itemName={itemName} targetItem={targetItem} name={item} key={item} selectAction={this.props.selectAction.bind(this)} {...this.state} />)}
    </ul> }
  </div>
  }
}

const NavPanelButton = ({ className, src, id, isShow, showControlPanelHandler }) => <img 
  style={ !isShow(id) ? { opacity: 0.2 } : null } 
  src={src} 
  className={className} 
  onDoubleClick={() => showControlPanelHandler(id)}
  alt="" 
/>

class App extends Component {
  constructor() {
    super()

    this.state = {
      regions: [],
      img: null,
      slideName: '',
      controlPanelSelectedItem: null,
      navPanel: {
        backBtn: {
          show: true,
          action: null
        },
        momBtn: {
          show: false,
          action: null
        },
        bankaBtn: {
          show: false,
          action: null
        },
        nextBtn: {
          show: true,
          action: null
        },
      }
    }
  }

  selectAction(id, payload) {
    this.setState(() => ({
      navPanel: {
        ...this.state.navPanel,
        [id]: {
          ...this.state.navPanel[id],
          action: payload ? {...payload} : null
        }
      }
    }))
  }
  
  isShow(id) {
    return this.state.navPanel[id].show
  }
  
  toggleVisivilityBtn(id = '') {
    this.setState(() => ({ 
      navPanel: {
        ...this.state.navPanel,
        [id]: {
          ...this.state.navPanel[id],
          show: !this.state.navPanel[id].show
        }
      }
     }))
  }

  showControlPanel(id = null) {
    this.setState(() => ({ controlPanelSelectedItem: id }))
  }

  changeSlideName(e) {
    const slideName = e.target.value
    this.setState(() => ({ slideName }))
  }

  getMarkupAndCopy() {
      if(!this.state.img) return alert('Картинку сначала загрузи, эээ')
      if(!this.state.slideName) return alert('алё, а "slidename" писать кто будет?')

      const markup = getMarkup({
        ...this.state.navPanel,
        regions: this.state.regions,
        img: this.state.imgName,
        slideName: this.state.slideName
      })

      this.textToCopyRef.value = markup
      this.textToCopyRef.select()
      document.execCommand("copy")
  }

  imgToBase64(e) {
    const file = e.target.files[0];
    const imgName = e.target.files[0].name
    const reader = new FileReader();
    reader.onloadend = () => this.setState(() => ({ imgName, img: reader.result }))
    reader.readAsDataURL(file);
  }

  regionsChange(regions) {
    this.setState(() => ({
      regions
    }))
  }

  regionRenderer({ isChanging, index, data }) {
    const changeRegionAction = (action, props = {}) => {
      const oldRegionsState = [...this.state.regions]
      oldRegionsState[index].data = {
        ...oldRegionsState[index].data,
        name: action,
        ...props
      }
      this.regionsChange(oldRegionsState)
    }

    const deleteRegion = () => {
      // const oldRegionsState = [...this.state.regions]
      // oldRegionsState.splice(data.index, 1)
      // console.log(oldRegionsState, data.index)
      // this.regionsChange(oldRegionsState)
    }

    if (!isChanging && !data.saved) {
			return <div className="control-panel" style={{ cursor: 'default', minWidth: 300, position: 'absolute', top: '99%', left: 0, width: '94%' }}>
        <p><span className="cp-item">action:</span></p>
        <ul className="cp-actions-list">
           {ACTIONS.map(action => <li key={action} onClick={() => changeRegionAction(action)}>
              <span style={{ fontWeight: data.name === action ? 'bold' : '' }}>
                <span style={{ display: 'block' }}>{action}</span>
                
                { data.name === action && action === ACTIONS[1] && 
                  <input placeholder="slidename" 
                    defaultValue={data.slideName} 
                    onChange={e => changeRegionAction(action, { slideName: e.target.value })}
                  /> 
                }

                { data.name === action && action === ACTIONS[2] && 
                  <div>
                    <input placeholder="sequence name" 
                      defaultValue={data.seqName} 
                      onChange={e => changeRegionAction(action, { seqName: e.target.value })}
                    /> 

                    <input placeholder="slide name" 
                      defaultValue={data.slideName} 
                      onChange={e => changeRegionAction(action, { slideName: e.target.value })}
                    /> 
                  </div>
                }
              </span>
           </li>)}
           <li onClick={() => changeRegionAction('data-pdf')}>
               <span style={{ display: 'block' }}>data-pdf</span>

               { data.name === 'data-pdf' && 
                  <input placeholder="pdf name" 
                    defaultValue={data.pdfName} 
                    onChange={e => changeRegionAction('data-pdf', { pdfName: e.target.value })}
                  /> 
                }
            </li>
        </ul>
        <div>
          <button style={{ float: 'right'}} onClick={deleteRegion}>delete area</button>
        </div>
      </div>
		}
  }

  render() {
    return <div className="container">
      <textarea ref={r => this.textToCopyRef = r} style={{ position: 'absolute', top: -5000, left: -5000, opacity: 0, width: 0, height: 0 }}>{this.state.textToCopy}</textarea>

      <input type="text" style={{ padding: 5, width: 300 }} placeholder="Slidename" onChange={this.changeSlideName.bind(this)} />
      
      { !this.state.img 
        ? <div>
            <img src="http://via.placeholder.com/1024x768" className="slide-img" alt="" />
            <input className="slide-img-upload" type="file" accept=".gif, .png, .jpeg, .jpg" onChange={this.imgToBase64.bind(this)} />
          </div>
        : <RegionSelect 
              className="region-select"
              regionStyle={{background: 'rgba(255, 0, 0, 0.5)'}} 
              regions={this.state.regions}
              regionRenderer={this.regionRenderer.bind(this)}
              onChange={this.regionsChange.bind(this)} 
              constraint={true}
            >
          <img className="slide-img" src={this.state.img} alt="" /> 
        </RegionSelect>
      }

      <div>
          <div className="absolute-center-x nav-btn-wrap">
              <NavPanelButton src={backBtn} className="back-btn" id="backBtn" isShow={this.isShow.bind(this)} showControlPanelHandler={this.showControlPanel.bind(this)} />
              <NavPanelButton src={bankaBtn} id="bankaBtn" isShow={this.isShow.bind(this)} showControlPanelHandler={this.showControlPanel.bind(this)} />
              <NavPanelButton src={momBtn} id="momBtn" isShow={this.isShow.bind(this)} showControlPanelHandler={this.showControlPanel.bind(this)} />
              <NavPanelButton src={nextBtn} className="next-btn" id="nextBtn" isShow={this.isShow.bind(this)} showControlPanelHandler={this.showControlPanel.bind(this)} />

              { this.state.controlPanelSelectedItem && 
                <ControlPanel {...this.state} showControlPanel={this.showControlPanel.bind(this)} position={{ top: -85, left: 12 }} toggleVisivilityBtn={this.toggleVisivilityBtn.bind(this)} selectAction={this.selectAction.bind(this)} /> 
              }
          </div>
      </div>

      <div>
        <br/>
        <button onClick={this.getMarkupAndCopy.bind(this)}>get template</button>
        <br/><br/><br/>
      </div>
    </div>
  }
}

export default App;
