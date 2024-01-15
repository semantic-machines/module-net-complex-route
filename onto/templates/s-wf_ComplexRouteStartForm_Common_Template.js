import BrowserUtil from '/js/browser/util.js';
import $ from 'jquery';
import IndividualModel from '/js/common/individual_model.js';

export const pre = function (individual, template, container, mode, extra) {
  template = $(template);
  container = $(container);

  const stages = [];
  const complex = 's-wf:ComplexRouteStartForm_';
  const simple = 's-wf:SimpleRouteStartForm_';
  const stagePromises = [];
  const notEditableStages = [];
  if (this.hasValue('v-wf:isProcess')) {
    $('#save_and_start_process', template).remove();
    for (const key in individual.properties) {
      if (key.indexOf(complex) != -1) {
        stages.push(key.split('_')[1]);
        stagePromises.push(individual[key][0].load());
      }
    }
  } else {
    $('span.statusWorkflow', template).remove();
    $('#on-document', template).remove();
    $('#save_and_start_process', template).on('click', function () {
      stages.forEach(function (stage) {
        const routeid = complex + stage;
        const sub = individual[routeid][0];
        if (sub) {
          if (!sub.hasValue(simple + 'participant') || sub.properties[simple + 'participant'].length == 0) {
            if (!sub.hasValue(simple + 'actions') || sub.properties[simple + 'actions'].length == 0) {
              individual[routeid] = [];
            }
          }
        } else {
          individual[routeid] = [];
        }
      });
      return notEditableStages
        .reduce(function (pr, curSub) {
          return pr.then(function () {
            return curSub.save();
          });
        }, Promise.resolve())
        .then(function () {
          BrowserUtil.send(individual, template);
        });
    });

    const doc = individual['v-wf:processedDocument'][0];
    individual['v-s:onDocument'] = [doc];

    if (individual.hasValue(complex + 'informing')) {
      stages.push('informing');
      individual[complex + 'informing'][0]['v-s:parent'] = [individual];
    }

    for (let i = 1; i <= 6; i++) {
      if (individual.hasValue(complex + 'coordination' + i)) {
        individual[complex + 'coordination' + i][0][simple + 'possible_decisions'] = [
          new IndividualModel('v-wf:DecisionAgreed'),
          new IndividualModel('v-wf:DecisionDeclined'),
          new IndividualModel('v-wf:DecisionNoAgreed'),
          new IndividualModel('v-wf:DecisionNotForMe'),
        ];
        individual[complex + 'coordination' + i][0][simple + 'task_label'] = ['Согласовать^ru', 'Coordinate^en'];
        stages.push('coordination' + i);
        individual[complex + 'coordination' + i][0]['v-s:parent'] = [individual];
      }
    }
    if (individual.hasValue(complex + 'introduction')) {
      individual[complex + 'introduction'][0][simple + 'possible_decisions'] = [new IndividualModel('v-wf:DecisionExamined')];
      individual[complex + 'introduction'][0][simple + 'task_label'] = ['Ознакомление^ru', 'Introduction^en'];
      stages.push('introduction');
      individual[complex + 'introduction'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'sign')) {
      individual[complex + 'sign'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionSign'),
        new IndividualModel('v-wf:DecisionDeclined'),
        new IndividualModel('v-wf:DecisionNotForMe'),
      ];
      individual[complex + 'sign'][0][simple + 'task_label'] = ['Подписать^ru', 'Sign^en'];
      stages.push('sign');
      individual[complex + 'sign'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'approval')) {
      individual[complex + 'approval'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionApprove'),
        new IndividualModel('v-wf:DecisionDeclined'),
        new IndividualModel('v-wf:DecisionNotForMe'),
      ];
      individual[complex + 'approval'][0][simple + 'task_label'] = ['Утвердить^ru', 'Approve^en'];
      stages.push('approval');
      individual[complex + 'approval'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'review')) {
      individual[complex + 'review'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionReview'),
        new IndividualModel('v-wf:DecisionRejected'),
        new IndividualModel('v-wf:DecisionNotForMe'),
      ];
      individual[complex + 'review'][0][simple + 'task_label'] = ['Рассмотреть^ru', 'Review^en'];
      stages.push('review');
      individual[complex + 'review'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'instruction')) {
      individual[complex + 'instruction'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionAchieved'),
        new IndividualModel('v-wf:DecisionRejected'),
        new IndividualModel('v-wf:DecisionNotPerformed'),
        new IndividualModel('v-wf:DecisionNotForMe'),
        new IndividualModel('v-wf:DecisionProlongate'),
      ];
      individual[complex + 'instruction'][0][simple + 'task_label'] = ['Исполнить поручение^ru', 'Execute task^en'];
      stages.push('instruction');
      individual[complex + 'instruction'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'instruction2')) {
      individual[complex + 'instruction2'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionAchieved'),
        new IndividualModel('v-wf:DecisionRejected'),
        new IndividualModel('v-wf:DecisionNotPerformed'),
        new IndividualModel('v-wf:DecisionNotForMe'),
      ];
      individual[complex + 'instruction2'][0][simple + 'task_label'] = ['Рассмотреть^ru', 'Execute task^en'];
      stages.push('instruction2');
      individual[complex + 'instruction2'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'instruction3')) {
      individual[complex + 'instruction3'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionAchieved'),
        new IndividualModel('v-wf:DecisionRejected'),
        new IndividualModel('v-wf:DecisionNotPerformed'),
        new IndividualModel('v-wf:DecisionNotForMe'),
      ];
      individual[complex + 'instruction3'][0][simple + 'task_label'] = ['Ознакомиться^ru', 'Execute task^en'];
      stages.push('instruction3');
      individual[complex + 'instruction3'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'instruction3_1')) {
      individual[complex + 'instruction3_1'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionAchieved'),
        new IndividualModel('v-wf:DecisionRejected'),
        new IndividualModel('v-wf:DecisionNotPerformed'),
        new IndividualModel('v-wf:DecisionNotForMe'),
      ];
      individual[complex + 'instruction3_1'][0][simple + 'task_label'] = ['Ознакомиться^ru', 'Execute task^en'];
      stages.push('instruction3_1');
      individual[complex + 'instruction3_1'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'instruction4')) {
      individual[complex + 'instruction4'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionAchieved'),
        new IndividualModel('v-wf:DecisionRejected'),
        new IndividualModel('v-wf:DecisionNotPerformed'),
        new IndividualModel('v-wf:DecisionNotForMe'),
        new IndividualModel('v-wf:DecisionProlongate'),
      ];
      individual[complex + 'instruction4'][0][simple + 'task_label'] = ['Исполнить поручение^ru', 'Execute task^en'];
      stages.push('instruction4');
      individual[complex + 'instruction4'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'examination')) {
      individual[complex + 'examination'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionExamined'),
        new IndividualModel('v-wf:DecisionNotForMe'),
      ];
      individual[complex + 'examination'][0][simple + 'task_label'] = ['Ознакомиться^ru', 'Examine^en'];
      stages.push('examination');
      individual[complex + 'examination'][0]['v-s:parent'] = [individual];
    }
    if (individual.hasValue(complex + 'autoinstruction')) {
      stages.push('autoinstruction');
    }
    if (individual.hasValue(complex + 'preautoinstruction')) {
      stages.push('preautoinstruction');
    }
    if (individual.hasValue(complex + 'distribution')) {
      stages.push('distribution');
    }
    if (individual.hasValue(complex + 'examination2')) {
      individual[complex + 'examination2'][0][simple + 'possible_decisions'] = [
        new IndividualModel('v-wf:DecisionExamined'),
        new IndividualModel('v-wf:DecisionNotForMe'),
      ];
      individual[complex + 'examination2'][0][simple + 'task_label'] = ['Ознакомиться^ru', 'Examine^en'];
      stages.push('examination2');
      individual[complex + 'examination2'][0]['v-s:parent'] = [individual];
    }
  }
  return Promise.all(stagePromises).then(function () {
    stages.forEach(function (stage) {
      const routeid = complex + stage;
      const sub = individual[routeid][0];
      if (!sub.hasValue(simple + 'visible') || sub[simple + 'visible'][0] == false) {
        $('.' + stage, template).hide();
      }
      if (!sub.hasValue(simple + 'editable') || sub[simple + 'editable'][0] == false) {
        $('.' + stage, template).attr('about', '@');
        $('.' + stage, template).removeAttr('data-embedded');
        sub['v-s:parent'] = [individual];

        if (individual.isNew()) {
          notEditableStages.push(sub);
          // sub.save();
        }
      }
    });
  });
};

export const post = function (individual, template, container, mode, extra) {
  template = $(template);
  container = $(container);

  if (!individual.hasValue('v-wf:isProcess')) {
    $('.actions #save', template).remove();
    $('.actions #edit', template).remove();
  }
};

export const html = `
  <div class="container sheet">
    <style scoped>
      .col-md-6 {
        min-height: 0px;
      }
    </style>
    <h2 about="s-wf:ComplexRouteStartForm" property="rdfs:label"></h2>
    <h4 id="on-document" about="@" rel="v-s:onDocument" data-template="v-ui:ClassNameLabelLinkTemplate"></h4>
    <br />
    <div class="row">
      <div class="col-md-6 simpleStartForm informing" rel="s-wf:ComplexRouteStartForm_informing" data-embedded="true">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_informing" property="rdfs:label"></span>
            </h3>
          </div>
          <div class="panel-body" about="@" data-embedded="true" data-template="s-wf:SimpleRouteStartFormMinimal_Template"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm introduction" rel="s-wf:ComplexRouteStartForm_introduction" data-embedded="true">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_introduction" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormShort_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm coordination1" rel="s-wf:ComplexRouteStartForm_coordination1" data-embedded="true">
        <div class="panel panel-success">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_coordination1" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormShort_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm coordination2" rel="s-wf:ComplexRouteStartForm_coordination2" data-embedded="true">
        <div class="panel panel-success">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_coordination2" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormShort_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>

      <div class="col-md-6 simpleStartForm coordination3" rel="s-wf:ComplexRouteStartForm_coordination3" data-embedded="true">
        <div class="panel panel-success">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_coordination3" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormShort_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm coordination4" rel="s-wf:ComplexRouteStartForm_coordination4" data-embedded="true">
        <div class="panel panel-success">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_coordination4" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormShort_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm coordination5" rel="s-wf:ComplexRouteStartForm_coordination5" data-embedded="true">
        <div class="panel panel-success">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_coordination5" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormShort_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm coordination6" rel="s-wf:ComplexRouteStartForm_coordination6" data-embedded="true">
        <div class="panel panel-success">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_coordination6" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormShort_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm sign" rel="s-wf:ComplexRouteStartForm_sign" data-embedded="true">
        <div class="panel panel-warning">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_sign" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormShort_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm instruction3_1" rel="s-wf:ComplexRouteStartForm_instruction3_1" data-embedded="true">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_instruction" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormFull_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm approval" rel="s-wf:ComplexRouteStartForm_approval" data-embedded="true">
        <div class="panel panel-warning">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_approval" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormShort_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm instruction4" rel="s-wf:ComplexRouteStartForm_instruction4" data-embedded="true">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_instruction" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormFull_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm review" rel="s-wf:ComplexRouteStartForm_review" data-embedded="true">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_review" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormFull_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm instruction" rel="s-wf:ComplexRouteStartForm_instruction" data-embedded="true">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_instruction" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormFull_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm instruction2" rel="s-wf:ComplexRouteStartForm_instruction2" data-embedded="true">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_instruction" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormFull_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm instruction3" rel="s-wf:ComplexRouteStartForm_instruction3" data-embedded="true">
        <div class="panel panel-info">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_instruction" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormFull_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm examination" rel="s-wf:ComplexRouteStartForm_examination" data-embedded="true">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_examination" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormMinimal_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm distribution" rel="s-wf:ComplexRouteStartForm_distribution" data-embedded="true">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_distribution" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormMinimal_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
      <div class="col-md-12 simpleStartForm preautoinstruction" rel="s-wf:ComplexRouteStartForm_preautoinstruction" data-embedded="true">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="@" property="rdfs:label"></span>
            </h3>
          </div>
          <ul
            class="list-group"
            about="@"
            rel="s-wf:SimpleRouteStartForm_actions"
            data-template="s-wf:SimpleRouteStartFormForActions_Template"
            data-embedded="true"></ul>
        </div>
      </div>
      <div class="col-md-12 simpleStartForm autoinstruction" rel="s-wf:ComplexRouteStartForm_autoinstruction" data-embedded="true">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="@" property="rdfs:label"></span>
            </h3>
          </div>
          <ul
            class="list-group"
            about="@"
            rel="s-wf:SimpleRouteStartForm_actions"
            data-template="s-wf:SimpleRouteStartFormForActions_Template"
            data-embedded="true"></ul>
        </div>
      </div>
      <div class="col-md-6 simpleStartForm examination2" rel="s-wf:ComplexRouteStartForm_examination2" data-embedded="true">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title clearfix">
              <span class="pull-left" about="s-wf:ComplexRouteStartForm_examination2" property="rdfs:label"></span>
              <span class="pull-right statusWorkflow" about="@" rel="v-wf:hasStatusWorkflow" data-template="v-ui:StatusTemplate"></span>
            </h3>
          </div>
          <div
            class="panel-body"
            about="@"
            data-template="s-wf:SimpleRouteStartFormMinimal_Template"
            data-embedded="true"
            style="min-height:380px; height:380px; overflow-y:auto; overflow-x:hidden;"></div>
        </div>
      </div>
    </div>
    <br />
    <div class="actions">
      <button type="button" class="action btn btn-warning" id="save_and_start_process" about="v-s:Send" property="rdfs:label"></button>
      <span about="@" data-template="v-ui:StandardButtonsTemplate" data-embedded="true" data-buttons="edit save cancel"></span>
    </div>
  </div>
`;
