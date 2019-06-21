import React from 'react';
import { Link } from 'react-router-dom';
import { IS_LOGGED_IN } from '../../graphql/queries';
import { Query, ApolloConsumer } from 'react-apollo';
import Modal from '../modal';
import './navbar.css';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false, modalType: null };
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({ modalOpen: false, modalType: null });
  }

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <div className='main-navbar-container'>
            <div className='navbar-content'>
              <div className='navbar-left'>
                <div className='navbar-logo'>
                  <p>GameHub</p>
                </div>
              </div>
              <div className='navbar-right'>
                <Query query={IS_LOGGED_IN}>
                  {({ data }) => {
                    if (data.isLoggedIn) {
                      return (
                        <div>
                          <button
                            onClick={e => {
                              e.preventDefault();
                              localStorage.removeItem('auth-token');
                              client.writeData({
                                data: { isLoggedIn: false }
                              });
                              this.props.history.push('/');
                            }}
                            className='session-button'
                          >
                            Logout
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <button
                            onClick={() =>
                              this.setState({
                                modalOpen: true,
                                modalType: 'signup'
                              })
                            }
                            className='session-button'
                          >
                            Signup
                          </button>
                          <button
                            onClick={() =>
                              this.setState({
                                modalOpen: true,
                                modalType: 'login'
                              })
                            }
                            className='session-button'
                          >
                            Login
                          </button>
                        </div>
                      );
                    }
                  }}
                </Query>
              </div>
            </div>
            {this.state.modalOpen && (
              <Modal type={this.state.modalType} closeModal={this.closeModal} />
            )}
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default NavBar;
