<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\AlsOccurrence;
use App\Well;
use App\Alternative;
use App\Criterion;
use App\ValueFunctionDataPoint;

class AlsController extends Controller
{
    public function mapPozos()
    {
        return view('als.map_pozos');
    }

    // API Function
    public function wells()
    {
        return Well::has('alsOccurrences')
            ->whereNotNull('longitude')
            ->whereNotNull('latitude')
            ->get()
            ->load(['alsOccurrences' => function ($query) {
                $query->orderBy('start_date', 'asc');
            }])
            ->load('field.basin');
    }

    public function matrix()
    {
        $criteria = Criterion::with('valueFunctionDataPoints')->get();
        $data = $criteria->map(function ($criterion) {
            return collect([
                'id' => $criterion->id,
                'name' => $criterion->name,
                'type' => $criterion->type,
                'weight' => $criterion->weight,
                'valueFunctions' => $criterion->valueFunctionsObject(),
            ]);
        });
        $alternatives = self::alternativesObject();
        return view('als.matrix', [
            'criteria' => $data,
            'alternatives' => $alternatives,
        ]);
    }

    public function matrixConfig()
    {
        return view('als.matrix_config');
    }

    public function matrixValueFunc()
    {
        $criteria = Criterion::all();
        return view('als.matrix_value_func', [
            'criteria' => $criteria
        ]);
    }

    public function matrixWeights()
    {
        $criteria = Criterion::all();
        return view('als.matrix_weights', [
            'criteria' => $criteria,
        ]);
    }

    public function matrixWeightsUpdate(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            $arr = explode('-', $key);
            if (array_has($arr, 1)) {
                $criterionId = $arr[1];
                $criterion = Criterion::findOrFail($criterionId);
                $criterion->weight = $value;
                $criterion->save();
            }
        }
        return redirect('/sla/matrix/weights');
    }

    private static function alternativesObject()
    {
        return Alternative::all()->keyBy('id')->map(function ($alternative) {
            return $alternative->name;
        });
    }

    public function matrixCriterionEdit($criterionId)
    {
        $criterion = Criterion::findOrFail($criterionId);
        $alternatives = self::alternativesObject();
        $valueFunctions = $criterion->valueFunctionsObject();
        return view('als.matrix_criterion_form', [
            'criterion' => $criterion,
            'alternatives' => $alternatives,
            'valueFunctions' => $valueFunctions,
        ]);
    }

    public function matrixCriterionNew()
    {
        $alternatives = self::alternativesObject();
        return view('als.matrix_criterion_form', [
            'alternatives' => $alternatives,
        ]);
    }

    private static function createValueFunctionsFromRequest($request, $criterionId)
    {
        $valueFunctions = [];
        foreach ($request->all() as $key => $value) {
            $matches = [];
            $dataKey = preg_match('/(\d+)-(\d+)-(\d+)/', $key, $matches) === 1;
            if ($dataKey) {
                $alternativeId = $matches[1];
                $row = $matches[2];
                $type = $matches[3] === '0' ? 'value': 'score';
                if (!isset($valueFunctions[$alternativeId])) {
                    $valueFunctions[$alternativeId] = [];
                }
                if (!isset($valueFunctions[$alternativeId][$row])) {
                    $valueFunctions[$alternativeId][$row] = [];
                }
                $valueFunctions[$alternativeId][$row][$type] = $value;
            }
        }

        foreach ($valueFunctions as $alternativeId => $dataPoints) {
            foreach ($dataPoints as $dataPoint) {
                ValueFunctionDataPoint::create([
                    'alternative_id' => $alternativeId,
                    'criterion_id' => $criterionId,
                    'value' => $dataPoint['value'],
                    'score' => $dataPoint['score'],
                ]);
            }
        }
    }

    public function matrixCriterionCreate(Request $request)
    {
        $criterion = new Criterion();
        $criterion->name = $request->name;
        $criterion->type = $request->type;
        $criterion->weight = $request->weight;
        $criterion->save();

        self::createValueFunctionsFromRequest($request, $criterion->id);
        return redirect('/sla/matrix/value_func');
    }

    public function matrixCriterionUpdate(Request $request, $criterionId)
    {
        $criterion = Criterion::findOrFail($criterionId);
        $criterion->name = $request->name;
        $criterion->type = $request->type;
        $criterion->weight = $request->weight;
        $criterion->save();

        ValueFunctionDataPoint
            ::where(['criterion_id' => $criterionId])
            ->delete();

        self::createValueFunctionsFromRequest($request, $criterionId);

        return redirect('/sla/matrix/value_func');
    }

    public function matrixAlternatives()
    {
        $alternatives = Alternative::all();
        return view('als.matrix_alternatives', [
            'alternatives' => $alternatives,
        ]);
    }

    public function matrixAlternativeNew()
    {
        return view('als.matrix_alternative_form');
    }

    public function matrixAlternativeEdit($id)
    {
        $alternative = Alternative::findOrFail($id);
        return view('als.matrix_alternative_form', [
            'alternative' => $alternative
        ]);
    }

    public function matrixAlternativeCreate(Request $request)
    {
        Alternative::create([
            'name' => $request->name,
        ]);
        return redirect('/sla/matrix/alternatives');
    }

    public function matrixAlternativeUpdate(Request $request, $id)
    {
        $alternative = Alternative::findOrFail($id);
        $alternative->name = $request->name;
        $alternative->save();
        return redirect('/sla/matrix/alternatives');
    }

    public function mapCampos()
    {
        return view('als.map_campos');
    }
}
