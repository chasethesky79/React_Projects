class EditableTimer extends React.Component {
    render() {
     const { title, project, elapsed, runningSince, editFormOpen } = this.props;
     return (
         <div>
            {editFormOpen
                ? <TimerForm 
                    title={title}
                    project={project}/>
                : <Timer
                    title={title}
                    project={project}
                    runningSince={runningSince}
                    elapsed={elapsed}/>
            }
        </div>
     )
    }
}
class EditableTimerList extends React.Component {
    render() {
        return (
          <div>
            <EditableTimer
              title='Learn React'
              project='Web Domination'
              elapsed='8986300'
              runningSince={null}
              editFormOpen={false}/>
            <EditableTimer
              title='Learn extreme Ironing'
              project='Web Domination'
              elapsed='3890985'
              runningSince={null}
              editFormOpen={true}/>
          </div>
        )
    }
}
class ToggleableTimerForm extends React.Component {
    render() {
        const { isOpen } = this.props;
        return (
            <div>
               {isOpen
                   ? <TimerForm/>
                   : <div className='ui basic content center aligned segment'><button className='ui basic button icon'><i className='plus icon'/></button></div>
               }
           </div>
        )
    }
}
class TimersDashboard extends React.Component {
    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList/>
                    <ToggleableTimerForm isOpen={false}/>
                </div>
            </div>
        )
    }
}
class TimerForm extends React.Component {
    render() {
        const { title, project } = this.props;
        const submitText = title ? 'Update': 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text' defaultValue={title}/>
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text' defaultValue={project}/>
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button'>
                                {submitText}
                            </button>
                            <button className='ui basic blue button'>
                                 Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
class Timer extends React.Component {
    render() {
      const { title, project, elapsed } = this.props;
      return (
        <div className='ui centered card'>
          <div className='content'>
            <div className='header'>
              {title}
            </div>
            <div className='meta'>
              {project}
            </div>
            <div className='center aligned description'>
              <h2>
                {helpers.renderElapsedString(elapsed)}
              </h2>
            </div>
            <div className='extra content'>
              <span className='right floated edit icon'>
                <i className='edit icon' />
              </span>
              <span className='right floated trash icon'>
                <i className='trash icon' />
              </span>
            </div>
          </div>
          <div className='ui bottom attached blue basic button'>
            Start
          </div>
        </div>
      );
    }
  }

  ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
  );