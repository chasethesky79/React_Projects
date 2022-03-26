class EditableTimer extends React.Component {
    state = {
        editFormOpen: false
    }
    render() {
     const { title, project, elapsed, runningSince, id, onFormSubmit, onDeleteTimer } = this.props;
     const { editFormOpen } = this.state;
     const handleOnClickCancel = () => this.setState({ editFormOpen: false })
     const handleOnClickEdit = () => this.setState({ editFormOpen: true })
     const handleTimerSubmit = (timerState, id) => {
         onFormSubmit(timerState, id);
         this.setState({ editFormOpen: false });
     }
     return (
         <div>
            {editFormOpen
                ? <TimerForm
                    id={id} 
                    title={title}
                    project={project}
                    onClickCancel={handleOnClickCancel}
                    onFormSubmit={handleTimerSubmit}/>
                : <Timer
                    id={id}
                    title={title}
                    project={project}
                    runningSince={runningSince}
                    elapsed={elapsed}
                    onClickEdit={handleOnClickEdit}
                    onDeleteTimer={onDeleteTimer}/>
            }
        </div>
     )
    }
}
class EditableTimerList extends React.Component {
    render() {
        const { timers, onFormSubmit, onDeleteTimer } = this.props;
        return (
          <div>
            {timers && timers.map(({ title, project, elapsed, runningSince, id }) => 
            <EditableTimer
              key={id}
              id={id}
              title={title}
              project={project}
              elapsed={elapsed}
              runningSince={runningSince}
              onFormSubmit={onFormSubmit}
              onDeleteTimer={onDeleteTimer}/>
            )}
          </div>
        )
    }
}
class ToggleableTimerForm extends React.Component {
    state = {
        isOpen: false
    }
    render() {
        const { isOpen } = this.state;
        const { onFormSubmit } = this.props;
        const handleOnClickCancel = () => this.setState({ isOpen: false })
        const handleTimerSubmit = (timerState) => {
            onFormSubmit(timerState);
            this.setState({ isOpen: false });
        }
        return (
            <div>
               {isOpen
                   ? <TimerForm onClickCancel={handleOnClickCancel} onFormSubmit={handleTimerSubmit}/>
                   : <div className='ui basic content center aligned segment'><button className='ui basic button icon' onClick={() => this.setState({ isOpen: true })}><i className='plus icon'/></button></div>
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
        const onFormSubmit = (timerState, id) => {
            const { title, project } = timerState;
            if (id) {
              this.setState({ timers: timers.map(timer => timer.id === id ? Object.assign({}, timer, { title, project }) : timer)})
            } else {
              const newTimer = helpers.newTimer(timerState);
              this.setState({ timers: timers.concat(newTimer)});
            }
        }
        const onDeleteTimer = id => this.setState({ timers: timers.filter(timer => timer.id !== id )});          
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList timers={timers} onFormSubmit={onFormSubmit} onDeleteTimer={onDeleteTimer}/>
                    <ToggleableTimerForm onFormSubmit={onFormSubmit}/>
                </div>
            </div>
        )
    }
}
class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || ''
    }
    render() {
        const { id, onClickCancel, onFormSubmit } = this.props;
        const { title, project } = this.state;
        const submitText = id ? 'Update': 'Create';
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text' value ={title} onChange={event => this.setState({ title: event.target.value })}/>
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text' value ={project} onChange={event => this.setState({ project: event.target.value })}/>
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button' onClick={() => onFormSubmit(this.state, id)}>
                                {submitText}
                            </button>
                            <button className='ui basic blue button' onClick={onClickCancel}>
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
      const { title, project, elapsed, id, onClickEdit, onDeleteTimer } = this.props;
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
                <i className='edit icon' onClick={onClickEdit}/>
              </span>
              <span className='right floated trash icon'>
                <i className='trash icon' onClick={() => onDeleteTimer(id)}/>
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