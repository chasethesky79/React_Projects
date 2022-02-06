class EditableTimer extends React.Component {
    state = {
        editFormOpen: false
    }
    render() {
     const { title, project, elapsed, runningSince, id } = this.props;
     const { editFormOpen } = this.state;
     return (
         <div>
            {editFormOpen
                ? <TimerForm 
                    title={title}
                    project={project}/>
                : <Timer
                    id={id}
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
        const { timers } = this.props;
        return (
          <div>
            {timers && timers.map(({ title, project, elapsed, runningSince, id }) => 
            <EditableTimer
              key={id}
              title={title}
              project={project}
              elapsed={elapsed}
              runningSince={runningSince}/>
            )}
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
    state = {
        timers: [
            {
                title: 'Practise Squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5456099,
                runningSince: Date.now()
            },
            {
                title: 'Bake Squash',
                project: 'Kitchen Chores',
                id: uuid.v4(),
                elapsed: 1273998,
                runningSince: null
            }
        ]
    }
    render() {
        const { timers } = this.state;
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList timers={timers}/>
                    <ToggleableTimerForm isOpen={true}/>
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
      const { title, project, elapsed, id } = this.props;
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