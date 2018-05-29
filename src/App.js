import React, { Component } from 'react';
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
}

const getMarkup = (p) => `
    <!-- * * * * * * * * * * * * START SLIDE * * * * * * * * * * * * -->
    <div class="container" data-slidename="${p.slideName}">
        <img class="full-width-img" src="${p.img}">

        <div class="inner-container-upper">
            <!--
            <p class="overlay-click-area hit1" data-go-to-slide="Slide_1"></p>
            <p class="overlay-click-area hit2" data-go-to-slide="Slide_2"></p>
            -->

            <!-- NAVIGATION PANEL -->
            <div class="absolute-center-x nav-btn-wrap">
                <img ${p.backBtn.show ? 'hidden' : ''} ${actionHelper(p.backBtn.action)} src="media/images/back.png" class="back-btn">
                <img ${p.bankaBtn.show ? 'hidden' : ''} ${actionHelper(p.bankaBtn.action)} src="media/images/banka.png">
                <img ${p.momBtn.show ? 'hidden' : ''} ${actionHelper(p.momBtn.action)} src="media/images/mom.png">
                <img ${p.nextBtn.show ? 'hidden' : ''} ${actionHelper(p.nextBtn.action)} src="media/images/next.png" class="next-btn">
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

  render() {
    console.log(this.state.navPanel)
    return <div className="container">
      <input type="text" style={{ padding: 5, width: 300 }} placeholder="Slidename" />
      <img src="http://via.placeholder.com/1024x768" alt="" />

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
        <button onClick={() => { console.log(getMarkup(this.state.navPanel)) }}>get template</button>
        <br/><br/><br/>
      </div>
    </div>
  }
}

export default App;
