import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Icon,
  Menu,
  Responsive,
  Sidebar,
  Visibility,
  Segment,
  Dropdown
} from 'semantic-ui-react'
import logo from '../IOI-Logo-new-03-e1594803890891.png';
import Cookies from 'js-cookie'
import LoginForm from './LoginPage';
import GameJoinPage from './GameJoinPage';

// Heads up!
// We using React Static to prerender our docs with server side rendering, this is a quite simple solution.
// For more advanced usage please check Responsive docs under the "Usage" section.
const getWidth = () => {
    const isSSR = typeof window === 'undefined'
  
    return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth
  }

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
    constructor() {
      super();
      const token = Cookies.get("username")
      let loggedIn = true
      let username = ''
      if (token == null) {
        loggedIn = false;
      } else {
        username = token
      }

      this.state = {
        username : username,
        loggedIn
      }
    }
    
    render() {
      const { children} = this.props
      const activeItem = this.props.activeItem
    if (this.state.loggedIn === true) {
      return <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
      <Visibility once={false}> <Menu
            fixed='top'
            size='large'
          >
              <Menu.Item
                as='a'
                href='/'
                name='home'
                active={activeItem === 'home'}
                
              >
                <img src={logo} alt="" className="logo"/>
              </Menu.Item>
              {/* <Menu.Item
                as='a'
                href='/explore'
                name='explore'
                active={activeItem === 'explore'}
              >Explore</Menu.Item> */}
            <Menu.Item position='right'>
            <GameJoinPage/>

                <Dropdown simple text= {this.state.username} direction='right'>
                    <Dropdown.Menu>
                        <Dropdown.Item text='Log out' as='a' href="/logout"></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Menu.Item>
              </Menu>
             
          </Visibility>
          {children}
        </Responsive>
    }
    return <Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
    <Visibility once={false}> <Menu
          fixed='top'
          size='large'
        >
            <Menu.Item
              as='a'
              href='/'
              name='home'
              active={activeItem === 'home'}
            >
            <img src={logo} alt="Logo"  className="logo"/>
            </Menu.Item>
            {/* <Menu.Item
              as='a'
              href='/explore'
              name='explore'
              active={activeItem === 'explore'}
            >Explore</Menu.Item> */}
            <GameJoinPage logout={false}/>
      <Menu.Item position='right'>  
        <LoginForm desktop={true}/>

        <Button as='a' href='/register' style={{ marginLeft: '0.5em' }}>Sign up
            </Button>
      </Menu.Item>
            </Menu>
        </Visibility>
        {children}
      </Responsive>

    }
  }
  
  DesktopContainer.propTypes = {
    children: PropTypes.node,
  }
  
  class MobileContainer extends Component {
    constructor() {
      super();
      const token = Cookies.get("username")
      let loggedIn = true
      let username = ''
      if (token == null) {
        loggedIn = false;
      } else {
        username = token
      }

      this.state = {
        username : username,
        loggedIn
      }
    }
  
    handleSidebarHide = () => this.setState({ sidebarOpened: false })
  
    handleToggle = () => this.setState({ sidebarOpened: true })
  
    render() {
      const { children} = this.props
      const { sidebarOpened } = this.state
      const activeItem = this.props.activeItem
      if (this.state.loggedIn === true) {

        return  <Responsive
        as={Sidebar.Pushable}
        getWidth={getWidth}
        maxWidth={Responsive.onlyMobile.maxWidth}
      >
        <Sidebar
          as={Menu}
          animation='push'
          inverted
          onHide={this.handleSidebarHide}
          vertical
          visible={sidebarOpened}
        >
          {/* <Menu.Item as='a' active>
            Quizhub
          </Menu.Item>
          <Menu.Item as='a'>Explore</Menu.Item> */}
          <Menu.Item
            as='a'
            href='/'
            name='home'
            active={activeItem === 'home'}
          >
          <img src={logo} alt="Logo"  className="logo"/>
          </Menu.Item>
          {/* <Menu.Item
            as='a'
            href='/explore'
            name='explore'
            active={activeItem === 'explore'}
          >
            Explore
          </Menu.Item> */}
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
              <Menu pointing secondary size='large'>
                <Menu.Item onClick={this.handleToggle}>
                  <Icon name='sidebar' />
                </Menu.Item>
                  <GameJoinPage/>
                <Menu.Item position='right'>
                <Dropdown simple text= {this.state.username} direction='right'>
                    <Dropdown.Menu>
                        <Dropdown.Item text='Log out' as='a' href="/logout"></Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </Menu.Item>
              </Menu>
          {children}
        </Sidebar.Pusher>
      </Responsive>
      }
      return  <Responsive
          as={Sidebar.Pushable}
          getWidth={getWidth}
          maxWidth={Responsive.onlyMobile.maxWidth}
        >
          <Sidebar
            as={Menu}
            animation='push'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            {/* <Menu.Item as='a' active>
              Quizhub
            </Menu.Item>
            <Menu.Item as='a'>Explore</Menu.Item> */}
            <Menu.Item
              as='a'
              href='/'
              name='home'
              active={activeItem === 'home'}
            >
            <img src={logo} alt="Logo"  className="logo"/>
            </Menu.Item>
            {/* <Menu.Item
              as='a'
              href='/explore'
              name='explore'
              active={activeItem === 'explore'}
            >
              Explore
            </Menu.Item> */}
            <Menu.Item>
                  <LoginForm desktop={false}/>
            </Menu.Item>
            <Menu.Item>

            <Button as='a' href='/register' style={{ marginLeft: '0.5em' }}>
                    Sign up
                  </Button>
                  </Menu.Item>
          </Sidebar>
  
          <Sidebar.Pusher dimmed={sidebarOpened}>
                <Menu pointing secondary size='large'>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name='sidebar' />
                  </Menu.Item>
                  <Menu.Item position='right'>

                  </Menu.Item>
                </Menu>
            {children}
          </Sidebar.Pusher>
        </Responsive>
      
    }
  }
  
  MobileContainer.propTypes = {
    children: PropTypes.node,
  }
  
  const ResponsiveContainer = ({ children, activeItem}) => (
    <div>
      <DesktopContainer activeItem={activeItem}>
        <div className="centerPage">
        {children}
        </div>
      </DesktopContainer>
  <MobileContainer><div className="centerPage">{children}</div></MobileContainer>
    </div>
  )
  
  ResponsiveContainer.propTypes = {
    children: PropTypes.node, 
  }

  export default ResponsiveContainer