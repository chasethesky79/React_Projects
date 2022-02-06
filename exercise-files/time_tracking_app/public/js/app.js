class EditableTimer extends React.Component {
    state = {
        editFormOpen: false
    }
    render() {
     const { title, project, elapsed, runningSince, id, onFormSubmit } = this.props;
     const { editFormOpen } = this.state;
     const handleOnClickCancel = () => this.setState({ editFormOpen: false })
     const handleOnClickEdit = () => this.setState({ editFormOpen: true })
     const handleTimerSubmit = (id, timerState) => {
         onFormSubmit(id, timerState);
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
                    onClickEdit={handleOnClickEdit}/>
            }
        </div>
     )
    }
}
class EditableTimerList extends React.Component {
    render() {
        const { timers, onFormSubmit } = this.props;
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
              onFormSubmit={onFormSubmit}/>
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
        return (
            <div>
               {isOpen
                   ? <TimerForm onClickCancel={handleOnClickCancel} onFormSubmit={onFormSubmit}/>
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
        const onFormSubmit = (id, timerState) => {
            const { title, project } = timerState;
            if (id) {
              this.setState({ timers: timers.map(timer => timer.id === id ? Object.assign({}, timer, { title, project }) : timer)})
            } else {
              const newTimer = helpers.newTimer(timerState);
              this.setState({ timers: timers.concat(newTimer)});
            }
        }
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList timers={timers} onFormSubmit={onFormSubmit}/>
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
                            <button className='ui basic blue button' onClick={() => onFormSubmit(id, this.state)}>
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
      const { title, project, elapsed, id, onClickEdit } = this.props;
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